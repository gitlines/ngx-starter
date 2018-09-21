import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {SideContentService} from '../../../../features/side-content/side-content.service';
import {ToolbarService} from '../../../../features/toolbar/toolbar.service';
import {EbsToolbarService} from '../ebs-toolbar.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'ebs-toolbar',
  templateUrl: './ebs-toolbar.component.html',
  styleUrls: ['./ebs-toolbar.component.scss']
})
export class EbsToolbarComponent implements OnInit, OnDestroy {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('EbsToolbarComponent');

  private _subs: Subscription[];

  @Input()
  public leftColumnTemplate: any;

  @Input()
  public centerColumnTemplate: any;

  @Input()
  public rightColumnTemplate: any;


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
