import {ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {EbsToolbarService} from '../ebs-toolbar.service';
import {EbsToolbarColumnPosition} from '../ebs-toolbar-column-position';
import {Observable} from 'rxjs';

@Component({
    selector: 'ebs-toolbar',
    templateUrl: './ebs-toolbar.component.html',
    styleUrls: ['./ebs-toolbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbsToolbarComponent implements OnInit {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger = LoggerFactory.getLogger('EbsToolbarComponent');

    /** The color of the Toolbar */
    @Input()
    public color: string;

    public readonly leftColumnTemplate$: Observable<TemplateRef<any>>;
    public readonly centerColumnTemplate$: Observable<TemplateRef<any>>;
    public readonly rightColumnTemplate$: Observable<TemplateRef<any>>;

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        private toolbarService: EbsToolbarService
    ) {
      this.leftColumnTemplate$ = toolbarService.activeColumnTemplate(EbsToolbarColumnPosition.LEFT);
      this.centerColumnTemplate$ = toolbarService.activeColumnTemplate(EbsToolbarColumnPosition.CENTER);
      this.rightColumnTemplate$ = toolbarService.activeColumnTemplate(EbsToolbarColumnPosition.RIGHT);
    }

    /***************************************************************************
     *                                                                         *
     * Life Cycle                                                              *
     *                                                                         *
     **************************************************************************/

    public ngOnInit(): void {}
}
