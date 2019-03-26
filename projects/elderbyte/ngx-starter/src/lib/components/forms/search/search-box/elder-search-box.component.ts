import {
  AfterContentInit, AfterViewInit, ChangeDetectionStrategy,
  Component, ContentChild,
  ElementRef, Input, OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LoggerFactory } from '@elderbyte/ts-logger';
import {SearchInput} from '../model/search-input';
import { NgModel } from '@angular/forms';
import {ElderSearchContextDirective} from '../elder-search-context.directive';
import {ElderSearchPanelComponent} from './elder-search-panel.component';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SimpleSearchInput} from '../model/simple-search-input';


export class OverlayState {
  constructor(
    public hasOverlay: boolean
  ) { }
}


@Component({
  selector: 'elder-search-box',
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

  private _searchInput: SimpleSearchInput;

  private readonly unsubscribe$ = new Subject();

  // The search expression input Element
  @ViewChild('search') search: ElementRef<HTMLInputElement>;

  // The search expression input model
  @ViewChild('expressionModel') expressionModel: NgModel;

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
  public name = 'query';

  @Input()
  public queryKey: string;

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

    this._searchInput = new SimpleSearchInput(this.name, this.queryKey);

    this._searchInput.resetRequest.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => this.reset());

    this.searchModel.register(this._searchInput);
  }

  public ngAfterViewInit(): void {
    this.expressionModel.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(value =>  this._searchInput.value = value);
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

  public get searchAttribute(): SearchInput {
    return this._searchInput;
  }

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

  /**
   * Reset the expression model
   */
  public reset(): void {
    this.expressionModel.reset();
  }


  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

}
