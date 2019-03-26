import {
  AfterContentInit, AfterViewInit,
  Component, ContentChild,
  ElementRef, Input, OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LoggerFactory } from '@elderbyte/ts-logger';
import {SearchAttribute, SimpleSearchAttribute} from '../search-attribute';
import { NgModel } from '@angular/forms';
import {ElderSearchModelDirective} from '../elder-search-model.directive';
import {ElderSearchPanelComponent} from './elder-search-panel.component';
import {BehaviorSubject, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';


export class OverlayState {
  constructor(
    public hasOverlay: boolean
  ) { }
}


@Component({
  selector: 'elder-search-box',
  templateUrl: './elder-search-box.component.html',
  styleUrls: ['./elder-search-box.component.scss']
})
export class ElderSearchBoxComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderSearchBoxComponent');

  private _queryAttribute: SimpleSearchAttribute;

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
  public autoSearchPanelEnabled = true;

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
    public readonly searchModel: ElderSearchModelDirective,
  ) {
  }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {

    this._queryAttribute = new SimpleSearchAttribute(this.name, this.queryKey);

    this._queryAttribute.resetRequest.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => this.reset());

    this.searchModel.register(this._queryAttribute);
  }

  public ngAfterViewInit(): void {
    this.expressionModel.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(value =>  this._queryAttribute.value = value);
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

  public get searchAttribute(): SearchAttribute {
    return this._queryAttribute;
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
