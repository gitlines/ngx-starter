import {Observable, Observer} from 'rxjs';
import {map} from 'rxjs/operators';
import {Injectable, NgZone} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';

/**
 * Angular reactive EventSource integration
 */
@Injectable({
  providedIn: 'root'
})
export class EventSourceService {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('EventSourceService');

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private zone: NgZone
  ) { }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Creates an observable stream for the given event source url and transforms the
   * data to the given json type.
   */
  public observableJson<T>(eventSourceUrl: string): Observable<T> {
    return this.observable(eventSourceUrl).pipe(
      map(event => JSON.parse(event.data))
    );
  }

  /**
   * Creates an observable stream for the given event source url.
   */
  public observable(eventSourceUrl: string, eventSourceInitDict?: EventSourceInit): Observable<MessageEvent> {

    return Observable.create((observer: Observer<any>) => {

      try {
        const eventSource = new EventSource(eventSourceUrl, eventSourceInitDict);

        eventSource.onopen = (event) => {
          this.logger.debug('EventSource connection opened to: ' + eventSourceUrl +
            ', state: ' + this.readyStateAsString(eventSource), event);
        };

        eventSource.onmessage = (event) => {
          this.logger.trace('EventSource on-message:', event);
          this.zone.run(() => observer.next(event)); // Ensure we run inside Angulars zone
        };

        eventSource.onerror = (error) => {
          if (eventSource.readyState === eventSource.CLOSED) {
            // We can safely treat it as a normal situation. Another way of detecting the end of the stream
            // is to insert a special element in the stream of events, which the client can identify as the last one.
            this.logger.debug('The SSE stream was closed. Reconnecting to ' + eventSourceUrl + '...');
          } else {
            this.logger.warn('There was an SSE error, current state: ' + this.readyStateAsString(eventSource), error);
          }
        };

        return () => {
          this.logger.debug('Closing the event-source since observable is in teardown.');
          eventSource.close();
        };

      } catch (err) {
        this.logger.error('Failed to subscribe to SSE at ' + eventSourceUrl, err);
        observer.error(err);
        observer.complete();
      }
    });

  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/


  private readyStateAsString(source: EventSource): string {
    if (source.readyState === source.OPEN) {
      return 'OPEN';
    } else if (source.readyState === source.CLOSED) {
      return 'CLOSED';
    } else if (source.readyState === source.CONNECTING) {
      return 'CONNECTING';
    } else {
      return 'UNKNOWN';
    }
  }

}
