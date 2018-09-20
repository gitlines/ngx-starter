import { Component, OnInit } from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {SideContentService} from '../../../../features/side-content/side-content.service';

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

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
      private sideContentService: SideContentService
  ) { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {

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
