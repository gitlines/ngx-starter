import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {Observable} from 'rxjs';
import {ElderConnectivityService, OnlineStatus} from '../elder-connectivity.service';

@Component({
    selector: 'elder-offline-indicator',
    templateUrl: './elder-offline-indicator.component.html',
    styleUrls: ['./elder-offline-indicator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElderOfflineIndicatorComponent implements OnInit {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly log = LoggerFactory.getLogger('ElderOfflineIndicatorComponent');

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
      private connectivityService: ElderConnectivityService
    ) {
    }

    /***************************************************************************
     *                                                                         *
     * Life Cycle                                                              *
     *                                                                         *
     **************************************************************************/

    public ngOnInit(): void {}

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/

    public get status$(): Observable<OnlineStatus> {
        return this.connectivityService.online$;
    }

}
