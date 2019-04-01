import {Observable, Observer, Subject, Subscription} from 'rxjs';
import {NgZone} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {map} from 'rxjs/operators';

/**
 * This class provides a reactive wrapper around an event source.
 *
 * It supports event type filtering out of the box and manages the registrations.
 *
 * Additionally, it also handles reconnects since the default reconect handling by browsers
 * is not working in a lot of cases (5xx errors etc).
 *
 */
export class ReactiveEventSource<T = any> {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ReactiveEventSource');

  private readonly eventTopics = new Map<string, Subject<MessageEvent>>();

  private currentSource: EventSource;
  private currentListeners = new Set<string>();

  private _closed: boolean;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private readonly zone: NgZone,
    private eventSourceUrl: string,
    private eventSourceInitDict?: EventSourceInit,
  ) {
    if (!eventSourceUrl) {
      throw new Error('You must provide a event source url!');
    }
    this.open();
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get closed(): boolean {
    return this._closed;
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Open the event source.
   *
   * Note: The connection is opened automatically upon object creation.
   * This method should only be used if this reactive-event-source has
   * been closed explicitly.
   */
  public open(): void {
    this._closed = false;
    this.reconnect();
  }

  /**
   * Get an event stream for the given event type.
   * @param eventType The event type. Defaults to 'message'.
   */
  public events(eventType: string = 'message'): Observable<MessageEvent> {
    if (!this.eventTopics.has(eventType)) {
      this.eventTopics.set(eventType, new Subject<MessageEvent>());
      this.ensureRegistrations();
    }
    return this.eventTopics.get(eventType).asObservable();
  }

  /**
   * Get an event stream of messages parsed from json.
   * (event.data must be in json format)
   *
   * @param eventType The event type. Defaults to 'message'.
   */
  public eventsJson(eventType: string = 'message'): Observable<T> {
    return this.events(eventType).pipe(
      map(event => JSON.parse(event.data))
    );
  }

  /**
   * Close this event source. It wont reconnect.
   */
  public close(): void {
    this._closed = true;
    this.closeCurrent();
    this.logger.debug('Closing the event-source.');
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  /**
   * Reconnects this event source, unless closed is true;
   */
  private reconnect(): void {

    if (this._closed) { return; }

    this.closeCurrent();

    try {
      this.currentSource = new EventSource(this.eventSourceUrl, this.eventSourceInitDict);

      this.ensureRegistrations();

      this.currentSource.onopen = (event) => {
        this.logger.debug('EventSource connection opened to: ' + this.eventSourceUrl +
          ', state: ' + this.readyStateAsString(this.currentSource), event);
      };

      this.currentSource.onerror = (error) => {

        this.logger.trace('There was an SSE error, current state: ' + this.readyStateAsString(this.currentSource), error);

        if (!this.closed) {
          // There was an error - try reconnecting
          this.logger.debug('Attempting to reconnect event-source at' + this.eventSourceUrl + '...');
          setTimeout(() => this.reconnect(), 3000); // Delay the reconnect
        } else {
          this.logger.debug('There was an error in the sse connection (closed).', error);
        }
      };

    } catch (err) {
      this.logger.error('Failed to create EventSource for ' + this.eventSourceUrl, err);
      setTimeout(() => this.reconnect(), 3000); // Delay the reconnect
    }
  }

  private ensureRegistrations(): void {
    if (this.currentSource) {
      this.eventTopics.forEach((subject, type) => {

        if (!this.currentListeners.has(type)) {
          this.currentSource.addEventListener(
            type,
            msg => subject.next(msg as MessageEvent),
            false
          );
          this.currentListeners.add(type);
          this.logger.debug('Listening to event type: ' + type);
        }
      });
    }
  }

  /**
   * Close the current event source
   */
  private closeCurrent(): void {

    this.currentListeners.clear();

    if (!this.currentClosed) {
      // Close Event Source if not already closed.
      this.logger.debug('Closing the event-source.');
      this.currentSource.close();
      this.currentSource = null;
    }
  }

  private get currentClosed(): boolean {
    return !this.currentSource || this.currentSource.readyState === this.currentSource.CLOSED;
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
