
import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {EbsToolbarTitleService} from './ebs-toolbar-title.service';
import {Observable, Subscription} from 'rxjs/index';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'ebs-toolbar-title',
  templateUrl: './ebs-toolbar-title.component.html',
  styleUrls: ['./ebs-toolbar-title.component.scss']
})
export class EbsToolbarTitleComponent implements OnInit, AfterViewInit {

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
    private toolbarService: EbsToolbarTitleService,
    private activatedRoute: ActivatedRoute
  ) {

  }

  /***************************************************************************
   *                                                                         *
   * Lifecycle                                                               *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {

  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.toolbarService.updateTitle(this.activatedRoute);
    }, 10);
  }

  /***************************************************************************
   *                                                                         *
   * Public Properties                                                       *
   *                                                                         *
   **************************************************************************/

  public get title(): Observable<string> {
    return this.toolbarService.titleChange
      .pipe(
        map(tb => tb.name)
      );
  }




}
