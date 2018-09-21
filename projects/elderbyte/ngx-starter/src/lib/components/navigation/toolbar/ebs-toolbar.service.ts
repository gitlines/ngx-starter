import { Injectable } from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {Observable, ReplaySubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EbsToolbarService {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger = LoggerFactory.getLogger('EbsToolbarService');

    private readonly _leftColumnDefaultChange: ReplaySubject<any> = new ReplaySubject<any>();
    private readonly _centerColumnDefaultChange: ReplaySubject<any> = new ReplaySubject<any>();
    private readonly _rightColumnDefaultChange: ReplaySubject<any> = new ReplaySubject<any>();

    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/

    constructor(
    ) {

    }

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/

    public get leftColumnDefaultChange(): Observable<any> {
      return this._leftColumnDefaultChange;
    }

    public get centerColumnDefaultChange(): Observable<any> {
        return this._centerColumnDefaultChange;
    }

    public get rightColumnDefaultChange(): Observable<any> {
        return this._rightColumnDefaultChange;
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public registerLeftColumnDefault(template: any): void {
        this.logger.debug('Registering default left toolbar column:', template);
        this._leftColumnDefaultChange.next(template);
    }

    public registerCenterColumnDefault(template: any): void {
        this.logger.debug('Registering default center toolbar column', template);
        this._centerColumnDefaultChange.next(template);
    }

    public registerRightColumnDefault(template: any): void {
        this.logger.debug('Registering default right toolbar column', template);
        this._rightColumnDefaultChange.next(template);
    }

    /***************************************************************************
     *                                                                         *
     * Private Methods                                                         *
     *                                                                         *
     **************************************************************************/


}
