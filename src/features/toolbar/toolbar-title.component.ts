
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToolbarService} from './toolbar.service';
import {Observable, Subscription} from 'rxjs/index';
import {map} from 'rxjs/operators';

@Component({
    selector: 'toolbar-title',
    templateUrl: './toolbar-title.component.html',
    styleUrls: ['./toolbar-title.component.scss']
})
export class ToolbarTitleComponent {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        private toolbarService: ToolbarService
    ) {

    }

    /***************************************************************************
     *                                                                         *
     * Lifecycle                                                               *
     *                                                                         *
     **************************************************************************/

    public title(): Observable<string> {
        return this.toolbarService.titleChange
            .pipe(
                map(tb => tb.name)
            )
    }
}
