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
      map(data => JSON.parse(data))
    );
  }

  /**
   * Creates an observable stream for the given event source url.
   */
  public observable(eventSourceUrl: string, eventSourceInitDict?: EventSourceInit): Observable<any> {

    return Observable.create((observer: Observer<any>) => {

      try {
        const eventSource = new EventSource(eventSourceUrl, eventSourceInitDict);

        eventSource.onmessage = (event) => {
          this.zone.run(() => observer.next(event.data)); // Ensure we run inside Angulars zone
        };

        eventSource.onerror = x => observer.error(x);

        return () => {
          // Close the event-source on Teardown
          eventSource.close();
        };
      } catch (err) {
        this.logger.error('Failed to subscribe to SSE at ' + eventSourceUrl, err);
        observer.error(err);
        observer.complete();
      }
    });

  }

}
