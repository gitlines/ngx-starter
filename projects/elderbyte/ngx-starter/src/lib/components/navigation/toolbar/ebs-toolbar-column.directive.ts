import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {EbsToolbarService} from './ebs-toolbar.service';
import {EbsToolbarColumnPosition} from './ebs-toolbar-column-position';

@Directive({
    selector: '[ebsToolbarColumn]'
})
export class EbsToolbarColumnDirective implements OnInit, OnDestroy {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger = LoggerFactory.getLogger('EbsToolbarColumnDirective');

    /** Position at which column should be placed. */
    @Input()
    public ebsToolbarColumn: EbsToolbarColumnPosition;

    /** If the column should be considered as default (fallback). */
    @Input()
    public ebsToolbarDefault: boolean;

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        private viewContainer: ViewContainerRef,
        private toolbarService: EbsToolbarService,
        public templateRef: TemplateRef<any>,
    ) { }

    /***************************************************************************
     *                                                                         *
     * Life Cycle                                                              *
     *                                                                         *
     **************************************************************************/

    public ngOnInit(): void {
        this.toolbarService.registerColumn(this.ebsToolbarColumn, this.templateRef, this.ebsToolbarDefault);
    }

    public ngOnDestroy(): void {
        this.toolbarService.deregisterColumn(this.templateRef, this.ebsToolbarColumn);
    }

}
