import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {EbsToolbarTitleService} from './ebs-toolbar-title.service';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'ebs-toolbar-title',
  templateUrl: './ebs-toolbar-title.component.html',
  styleUrls: ['./ebs-toolbar-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbsToolbarTitleComponent implements OnInit, AfterViewInit {

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
