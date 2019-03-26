import {AfterViewInit, Directive, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {Observable} from 'rxjs/internal/Observable';
import {debounceTime, flatMap, map, takeUntil} from 'rxjs/operators';
import {SearchAttribute, SearchAttributeState} from './search-attribute';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {Subject} from 'rxjs/internal/Subject';
import {combineLatest} from 'rxjs';
import {Filter} from '../../../common/data/filter';
import {FilterContext} from '../../../common/data/filter-context';


/**
 * The search container manages a group of search-inputs
 * and holds their values in a central search model.
 */
@Directive({
  selector: '[elderSearchModel]',
  exportAs: 'elderSearchModel'
})
export class ElderSearchModelDirective implements OnInit, AfterViewInit, OnDestroy {


  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly log = LoggerFactory.getLogger('ElderSearchModelDirective');

  private readonly unsubscribe$ = new Subject();

  private readonly _searchAttributes = new BehaviorSubject<SearchAttribute[]>([]);
  private readonly _searchStates = new BehaviorSubject<SearchAttributeState[]>([]);
  private readonly _filters = new BehaviorSubject<Filter[]>([]);

  /**
   * Automatically trigger a search request after the model has changed.
   */
  @Input()
  public searchModelImmediateTrigger: boolean;

  private _filterContext: FilterContext;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor() {

  }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void { }

  public ngAfterViewInit(): void {
    this._searchAttributes.pipe(
      takeUntil(this.unsubscribe$),
      flatMap(attributes => combineLatest(attributes.map(a => a.state$))),
      debounceTime(5)
    ).subscribe(states => {

      this._searchStates.next(states);

      const filters = this.convertToFilters(states);

      this.log.debug('Search-Model states updated:', states);

      this._filters.next(filters);

      if (this.filterContext) {
        this.filterContext.replaceFilters(filters);
      }

    });
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

  @Input('elderSearchModel')
  public set filterContext(value: FilterContext) {
    this._filterContext = value;
  }

  public get filterContext(): FilterContext {
    return this._filterContext;
  }

  public get attributes(): Observable<SearchAttribute[]> {
    return this._searchAttributes.asObservable();
  }

  public get attributesSnapshot(): SearchAttribute[] {
    return this._searchAttributes.getValue();
  }

  public get states$(): Observable<SearchAttributeState[]> {
    return this._searchStates.asObservable();
  }

  public get statesSnapshot(): SearchAttributeState[] {
    return this._searchStates.getValue();
  }

  /**
   * Returns the current user touched attributes. (ignoring fallbacks)
   */
  public get userDefinedAttributes$(): Observable<SearchAttributeState[]> {
    return this.states$.pipe(
      map(states => states.filter(s => !s.pristine))
    );
  }

  /**
   * Returns the current active filters
   */
  public get filters$(): Observable<Filter[]> {
    return this._filters.asObservable();
  }

  public get filtersSnapshot(): Filter[] {
    return this._filters.getValue();
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Register a new search attribute in this container
   */
  public register(attribute: SearchAttribute): void {
    this.log.debug('Registering search control ', attribute);
    const current = this._searchAttributes.getValue();
    this._searchAttributes.next([...current, attribute]);
  }

  public reset(): void {
    this.attributesSnapshot
      .filter(attr => !attr.readonly)
      .forEach(a => {
        a.reset();
    });
  }

  /*
  public getActiveFilterCount(skip: string[]): number {
    return this.countActiveFilters(this._model, skip);
  }*/

  /***************************************************************************
   *                                                                         *
   * Private                                                                 *
   *                                                                         *
   **************************************************************************/

  private convertToFilters(states: SearchAttributeState[]): Filter[] {
    return states
      .filter(a => a.hasValue)
      .map(s => new Filter(s.queryKey, s.queryValue));
  }

}

