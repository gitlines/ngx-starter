import {Observable, Observer, Subject, Subscription} from 'rxjs';
import {NgZone} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {map} from 'rxjs/operators';

/**
 * This class provides a reactive wrapper around an event source.
 *
 * Additionally, it also handles reconnects since the default reconect handling by browsers
 * is not working in a lot of cases (5xx errors etc).
 */
export class ReactiveEventSource<T = any> {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ReactiveEventSource');

  private sseEvents = new Subject<MessageEvent>();
  private sseSubscription: Subscription = null;
  private closed = false;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private readonly zone: NgZone,
    private eventSourceUrl: string,
    private eventSourceInitDict?: EventSourceInit
  ) {
    if (!eventSourceUrl) { throw new Error('You must provide a event source url!'); }

    this.reconnect();
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Reconnects this event source.
   *
   */
  public reconnect(): void {

    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe();
    }

    this.sseSubscription = this.observableEventSource(this.eventSourceUrl, this.eventSourceInitDict)
      .subscribe(
        message => this.sseEvents.next(message),
        err => {

          if (!this.closed) {
            // There was an error - try reconnecting
            this.logger.debug('Attempting to reconnect event-source at' + this.eventSourceUrl + '...');

            setTimeout(() => {
              this.reconnect();
            }, 3000); // Delay the reconnect
          } else {
            this.logger.debug('There was an error in the sse connection (closed).', err);
          }

        },
        () => {
          this.sseSubscription = null;
          this.logger.debug('Active event source connection has been closed.');
        }
      );
  }

  /**
   * Get an event stream of messages from this event source.
   */
  public get events(): Observable<MessageEvent> {
    return this.sseEvents.asObservable();
  }

  /**
   * Get an event stream of messages parsed from json.
   * (Event.data must be in json format)
   */
  public  eventsJson(): Observable<T> {
    return this.events.pipe(
      map(event => JSON.parse(event.data))
    );
  }


  /**
   * Close this event source. It wont reconnect.
   */
  public close(): void {

    this.closed = true;

    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe();
      this.sseSubscription = null;
    }
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  /**
   * Creates an observable which wraps around an event source connection.
   */
  private observableEventSource(eventSourceUrl: string, eventSourceInitDict?: EventSourceInit): Observable<MessageEvent> {

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

          this.logger.trace('There was an SSE error, current state: ' + this.readyStateAsString(eventSource), error);

          this.zone.run(() => {  // Ensure we run inside Angulars zone
            // While a EventSource should automatically reconnect as long its not closed,
            // in reality it will not reconnect on 5xx errors such as gateway timeouts.
            // Meaning we can not rely on this reconnect so we fail fast. (reconnect is handled by outside logic)
            observer.error(error);
            observer.complete();
          });
        };

        return () => {
          if (eventSource.readyState !== eventSource.CLOSED) {
            // Close Event Source if not already closed.
            this.logger.debug('Closing the event-source since observable is in teardown.');
            eventSource.close();
          }
        };

      } catch (err) {
        this.logger.error('Failed to create EventSource for ' + eventSourceUrl, err);
        observer.error(err);
        observer.complete();
      }
    });
  }

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
