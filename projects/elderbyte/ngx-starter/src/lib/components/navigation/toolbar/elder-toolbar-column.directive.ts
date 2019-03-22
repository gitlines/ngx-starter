import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {ElderToolbarService} from './elder-toolbar.service';
import {ToolbarColumnPosition} from './toolbar-column-position';

@Directive({
    selector: '[elderToolbarColumn], [ebsToolbarColumn]'
})
export class ElderToolbarColumnDirective implements OnInit, OnDestroy {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger = LoggerFactory.getLogger('ElderToolbarColumnDirective');

    /** Position at which column should be placed. */
    @Input()
    public ebsToolbarColumn: ToolbarColumnPosition;

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
        private toolbarService: ElderToolbarService,
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
