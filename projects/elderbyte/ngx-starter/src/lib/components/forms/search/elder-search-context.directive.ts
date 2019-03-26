import {AfterViewInit, Directive, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {Observable} from 'rxjs/internal/Observable';
import {debounceTime, flatMap, map, takeUntil} from 'rxjs/operators';
import {SearchInput} from './model/search-input';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {Subject} from 'rxjs/internal/Subject';
import {combineLatest} from 'rxjs';
import {Filter} from '../../../common/data/filter';
import {FilterContext} from '../../../common/data/filter-context';
import {SearchInputState} from './model/search-input-state';


/**
 * The search container manages a group of search-inputs
 * and holds their values in a central search model.
 */
@Directive({
  selector: '[elderSearchContext]',
  exportAs: 'elderSearchContext'
})
export class ElderSearchContextDirective implements OnInit, AfterViewInit, OnDestroy {


  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly log = LoggerFactory.getLogger('ElderSearchContextDirective');

  private readonly unsubscribe$ = new Subject();

  private readonly _searchAttributes = new BehaviorSubject<SearchInput[]>([]);
  private readonly _searchStates = new BehaviorSubject<SearchInputState[]>([]);
  private readonly _filters = new BehaviorSubject<Filter[]>([]);

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
      this._filters.next(filters);

      this.log.trace('Search-Model filters updated:', filters);

      if (this.filterContext) {
        this.filterContext.updateFilters(filters);
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

  @Input('elderSearchContext')
  public set filterContext(value: FilterContext) {
    this._filterContext = value;
  }

  public get filterContext(): FilterContext {
    return this._filterContext;
  }

  public get attributes(): Observable<SearchInput[]> {
    return this._searchAttributes.asObservable();
  }

  public get attributesSnapshot(): SearchInput[] {
    return this._searchAttributes.getValue();
  }

  public get states$(): Observable<SearchInputState[]> {
    return this._searchStates.asObservable();
  }

  public get statesSnapshot(): SearchInputState[] {
    return this._searchStates.getValue();
  }

  /**
   * Returns the current user touched attributes. (ignoring fallbacks)
   */
  public get userDefinedAttributes$(): Observable<SearchInputState[]> {
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
  public register(attribute: SearchInput): void {
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

  /***************************************************************************
   *                                                                         *
   * Private                                                                 *
   *                                                                         *
   **************************************************************************/

  private convertToFilters(states: SearchInputState[]): Filter[] {
    return states
      .filter(a => a.hasValue)
      .map(s => new Filter(s.queryKey, s.queryValue));
  }

}

