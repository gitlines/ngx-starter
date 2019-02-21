import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {EbsToolbarService} from '../ebs-toolbar.service';
import {EbsToolbarColumnPosition} from '../ebs-toolbar-column-position';

@Component({
    selector: 'ebs-toolbar',
    templateUrl: './ebs-toolbar.component.html',
    styleUrls: ['./ebs-toolbar.component.scss']
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

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        private toolbarService: EbsToolbarService
    ) {}

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

    public get leftColumnTemplate(): TemplateRef<any> {
        return this.toolbarService.columns.has(EbsToolbarColumnPosition.LEFT) ?
            this.toolbarService.columns.get(EbsToolbarColumnPosition.LEFT) :
            this.toolbarService.columnDefaults.get(EbsToolbarColumnPosition.LEFT);
    }

    public get centerColumnTemplate(): TemplateRef<any> {
        return this.toolbarService.columns.has(EbsToolbarColumnPosition.CENTER) ?
            this.toolbarService.columns.get(EbsToolbarColumnPosition.CENTER) :
            this.toolbarService.columnDefaults.get(EbsToolbarColumnPosition.CENTER);
    }

    public get rightColumnTemplate(): TemplateRef<any> {
        return this.toolbarService.columns.has(EbsToolbarColumnPosition.RIGHT) ?
            this.toolbarService.columns.get(EbsToolbarColumnPosition.RIGHT) :
            this.toolbarService.columnDefaults.get(EbsToolbarColumnPosition.RIGHT);
    }

}
