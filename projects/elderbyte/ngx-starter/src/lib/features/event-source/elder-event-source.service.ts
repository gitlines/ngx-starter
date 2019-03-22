import {Observable} from 'rxjs';
import {Injectable, NgZone} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {ReactiveEventSource} from './reactive-event-source';

/**
 * Angular reactive EventSource integration
 */
@Injectable({
  providedIn: 'root'
})
export class ElderEventSourceService {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderEventSourceService');

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
   * Creates an reactive, automatic reconnecting event source.
   *
   * @param eventSourceUrl The url to the event source
   * @param eventSourceInitDict Additional configuration to use when connecting. (optional)
   */
  public reactiveEventSource<T = any>(eventSourceUrl: string, eventSourceInitDict?: EventSourceInit): ReactiveEventSource<T> {
    return new ReactiveEventSource(
      this.zone,
      eventSourceUrl,
      eventSourceInitDict
    );
  }

  /**
   * Creates an observable stream for the given event source url and transforms the
   * data to the given json type.
   *
   * @deprecated Use reactiveEventSource directly for more control.
   */
  public observableJson<T>(eventSourceUrl: string): Observable<T> {
    return this.reactiveEventSource(eventSourceUrl).eventsJson();
  }

  /**
   * Creates an observable stream for the given event source url.
   *
   * @deprecated Use reactiveEventSource directly for more control.
   */
  public observable(eventSourceUrl: string, eventSourceInitDict?: EventSourceInit): Observable<MessageEvent> {
    return this.reactiveEventSource(eventSourceUrl, eventSourceInitDict).events;
  }

}
