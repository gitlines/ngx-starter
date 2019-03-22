import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ElderToolbarTitleService} from './elder-toolbar-title.service';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'elder-toolbar-title, ebs-toolbar-title',
  templateUrl: './elder-toolbar-title.component.html',
  styleUrls: ['./elder-toolbar-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElderToolbarTitleComponent implements OnInit, AfterViewInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  public title$: Observable<string>;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private toolbarService: ElderToolbarTitleService,
    private activatedRoute: ActivatedRoute
  ) {

  }

  /***************************************************************************
   *                                                                         *
   * Lifecycle                                                               *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {
    this.title$ = this.toolbarService.titleChange
      .pipe(
        map(tb => tb.name)
      );
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.toolbarService.updateTitle(this.activatedRoute);
    }, 10);
  }
}
