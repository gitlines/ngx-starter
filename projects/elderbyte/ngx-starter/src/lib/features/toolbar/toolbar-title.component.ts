
import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ToolbarService} from './toolbar.service';
import {Observable, Subscription} from 'rxjs/index';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'toolbar-title',
  templateUrl: './toolbar-title.component.html',
  styleUrls: ['./toolbar-title.component.scss']
})
export class ToolbarTitleComponent implements OnInit, AfterViewInit {

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
    private toolbarService: ToolbarService,
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
