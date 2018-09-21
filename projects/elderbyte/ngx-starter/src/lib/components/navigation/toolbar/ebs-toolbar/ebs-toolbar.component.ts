import {AfterContentInit, Component, ContentChild, ContentChildren, Input, OnDestroy, OnInit, QueryList, TemplateRef} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {SideContentService} from '../../../../features/side-content/side-content.service';
import {EbsToolbarService} from '../ebs-toolbar.service';
import {Subscription} from 'rxjs';
import {EbsToolbarColumnDirective} from '../ebs-toolbar-column.directive';

@Component({
  selector: 'ebs-toolbar',
  templateUrl: './ebs-toolbar.component.html',
  styleUrls: ['./ebs-toolbar.component.scss']
})
export class EbsToolbarComponent implements OnInit, OnDestroy, AfterContentInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('EbsToolbarComponent');

  private _subs: Subscription[];

  @ContentChildren(EbsToolbarColumnDirective)
  public columns: QueryList<EbsToolbarColumnDirective>;

  public leftColumnTemplate: any;
  public centerColumnTemplate: any;
  public rightColumnTemplate: any;

  @Input()
  public color: string;

  @Input()
  public enableSideNavToggle = true;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
      private toolbarService: EbsToolbarService,
      private sideContentService: SideContentService
  ) { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {

    this._subs = [
      this.toolbarService.leftColumnDefaultChange.subscribe(
          template => this.leftColumnTemplate = template
      ),

      this.toolbarService.centerColumnDefaultChange.subscribe(
          template => this.centerColumnTemplate = template
      ),

      this.toolbarService.rightColumnDefaultChange.subscribe(
          template => {
            this.logger.debug('Received right column change:', template);
            this.rightColumnTemplate = template;
          }
      ),
    ];

  }

  public ngAfterContentInit(): void {
    this.columns.forEach(column => {
      switch (column.ebsToolbarColumn) {
          case 'left':
            this.leftColumnTemplate = column.templateRef;
            break;
          case 'center':
            this.centerColumnTemplate = column.templateRef;
            break;
          case 'right':
            this.rightColumnTemplate = column.templateRef;
            break;
          default:
            throw Error('Could not init Toolbar since columns are not identifiable! Have you set the columnId?');
      }
    });
  }

  public ngOnDestroy(): void {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public toggleSideNav(): void {
    this.sideContentService.toggleSidenav();
  }

}
