import {
  AfterContentInit, AfterViewInit, ChangeDetectionStrategy,
  Component, ContentChild,
  ElementRef, Input, OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LoggerFactory } from '@elderbyte/ts-logger';
import {ElderSearchContextDirective} from '../elder-search-context.directive';
import {ElderSearchPanelComponent} from './elder-search-panel.component';
import {BehaviorSubject, Subject} from 'rxjs';


export class OverlayState {
  constructor(
    public hasOverlay: boolean
  ) { }
}


@Component({
  selector: 'elder-search-box',
  exportAs: 'elderSearchBox',
  templateUrl: './elder-search-box.component.html',
  styleUrls: ['./elder-search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElderSearchBoxComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderSearchBoxComponent');

  private readonly unsubscribe$ = new Subject();

  // The search expression input Element
  @ViewChild('search') search: ElementRef<HTMLInputElement>;

  @ContentChild(ElderSearchPanelComponent) advancedSearch: ElderSearchPanelComponent;

  public readonly overlayState$ = new BehaviorSubject<OverlayState>(new OverlayState(false));

  /***************************************************************************
   *                                                                         *
   * Public API Fields                                                       *
   *                                                                         *
   **************************************************************************/

  /**
   * Display the search panel immediately when the user enters the search box.
   */
  @Input()
  public autoPanel = true;

  @Input()
  public name = 'searchExpression';

  @Input()
  public queryKey = 'query';

  @Input()
  public placeholder: string;

  @Input()
  public hint: string;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    public readonly searchModel: ElderSearchContextDirective,
  ) {
  }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {

  }

  public ngAfterViewInit(): void {

  }


  public ngAfterContentInit(): void {
    this.overlayState$.next(new OverlayState(!!this.advancedSearch));
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public blurFocus(event: any): void {
    setTimeout(() => this.search.nativeElement.blur(), 0);
  }

  /**
   * Occurs when the user clicks the clear search button
   */
  public clearSearch(event: any): void {
    this.searchModel.reset();
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

}
