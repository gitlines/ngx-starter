import {ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {ElderToolbarService} from '../elder-toolbar.service';
import {ToolbarColumnPosition} from '../toolbar-column-position';
import {Observable} from 'rxjs';

@Component({
    selector: 'elder-toolbar, ebs-toolbar',
    templateUrl: './elder-toolbar.component.html',
    styleUrls: ['./elder-toolbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElderToolbarComponent implements OnInit {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger = LoggerFactory.getLogger('ElderToolbarComponent');

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
        private toolbarService: ElderToolbarService
    ) {
      this.leftColumnTemplate$ = toolbarService.activeColumnTemplate(ToolbarColumnPosition.LEFT);
      this.centerColumnTemplate$ = toolbarService.activeColumnTemplate(ToolbarColumnPosition.CENTER);
      this.rightColumnTemplate$ = toolbarService.activeColumnTemplate(ToolbarColumnPosition.RIGHT);
    }

    /***************************************************************************
     *                                                                         *
     * Life Cycle                                                              *
     *                                                                         *
     **************************************************************************/

    public ngOnInit(): void {}
}
