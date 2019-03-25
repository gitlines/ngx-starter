
import {Injectable} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {map, tap} from 'rxjs/operators';
import {fromEvent, merge, Observable, of} from 'rxjs';

export class OnlineStatus {

    public static online() {
        return new OnlineStatus(true, new Date());
    }

    public static offline() {
        return new OnlineStatus(false, new Date());
    }

    constructor(
      public online: boolean,
      public timeStamp: Date
    ) {}

}

/**
 * This service manages the side content.
 * This is usually the left side which is a 'side nav' and the right side which shows detail information.
 */
@Injectable({
    providedIn: 'root'
})
export class ElderConnectivityService {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly log = LoggerFactory.getLogger('ElderConnectivityService');

    private readonly _online$: Observable<OnlineStatus>;

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
    ) {

        this._online$ =
          merge(
            of(new OnlineStatus(navigator.onLine, new Date())),
            fromEvent(window, 'offline').pipe(
              map(() => OnlineStatus.offline())
            ),
            fromEvent(window, 'online').pipe(
              map(() => OnlineStatus.online())
            )
          )
            .pipe(
              tap(status => {
                  if (status.online) {
                      this.log.info('Established internet connection!');
                  } else {
                      this.log.warn('Lost internet connection!');
                  }
              })
            );
    }

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/

    public get online$(): Observable<OnlineStatus> {
        return this._online$;
    }
}

