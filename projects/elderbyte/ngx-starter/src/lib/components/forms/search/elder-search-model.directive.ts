import { Directive, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { LoggerFactory } from '@elderbyte/ts-logger';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, map } from 'rxjs/operators';
import { SearchAttribute } from './search-attribute';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';
import { Subject } from 'rxjs/internal/Subject';
import {PropertyPathUtil} from '../../../common/utils/property-path-util';


export class Attribute {
  constructor(
    public readonly name: string,
    public readonly key: string,
    public readonly value: any
  ) { }
}


/**
 * The search container manages a group of search-inputs
 * and holds their values in a central search model.
 */
@Directive({
  selector: '[elderSearchModel]',
  exportAs: 'elderSearchModel'
})
export class ElderSearchModelDirective implements OnInit, OnDestroy {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly log = LoggerFactory.getLogger('ElderSearchModelDirective');

  private _sub: Subscription;

  private readonly _searchAttributes: SearchAttribute[] = [];
  private readonly _queryModel = new BehaviorSubject<Map<string, Attribute>>(new Map());

  private readonly _model = new Map<SearchAttribute, any>();
  private readonly _modelChanged = new BehaviorSubject<Map<SearchAttribute, any>>(this._model);

  private readonly _searchRequested = new Subject<Map<string, Attribute>>();

  private readonly _activeFilterCount = new BehaviorSubject<number>(0);
  /**
   * Automatically trigger a search request after the model has changed.
   */
  @Input()
  public searchModelImmediateTrigger: boolean;
  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor() { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {
    this._sub = this._modelChanged.pipe(
      debounceTime(100)
    ).subscribe(
        model => {

          this.log.trace('Internal search model has changed', model);

          const queryModel = this.buildQueryModel(model);
          this._queryModel.next(queryModel);

          this._activeFilterCount.next(this.countActiveFilters(model, []));

          this.log.debug('Query-Model (' + this.hasActiveFilter + ') has updated:', queryModel);

          if (this.searchModelImmediateTrigger) {
            this.requestSearch();
          }
        }
      );
  }

  public ngOnDestroy(): void {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  @Output()
  public get modelChanged(): Observable<Map<SearchAttribute, any>> {
    return this._modelChanged;
  }

  @Output()
  public get queryModelChanged(): Observable<Map<string, Attribute>> {
    return this._queryModel;
  }

  @Output()
  public get activeFilterCountChanged(): Observable<number> {
    return this._activeFilterCount;
  }

  @Output()
  public get searchRequested(): Observable<Map<string, Attribute>> {
    return this._searchRequested;
  }

  @Output()
  public get hasActiveFilterChanged(): Observable<boolean> {
    return this.activeFilterCountChanged.pipe(
      map(size => size > 0)
    );
  }

  public get hasActiveFilter(): boolean {
    return this._activeFilterCount.getValue() > 0;
  }

  public get attributes(): SearchAttribute[] {
    return this._searchAttributes;
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
    this.log.debug('Registering search control ' + attribute);
    this.registerInternal(attribute);
    this._searchAttributes.push(attribute);
  }

  public reset(): void {
    this.attributes
      .filter(attr => !attr.readonly)
      .forEach(a => {
        a.reset();
    });
  }

  public requestSearch(): void {
    this._searchRequested.next(this._queryModel.getValue());
  }

  public getActiveFilterCount(skip: string[]): number {
    return this.countActiveFilters(this._model, skip);
  }

  /***************************************************************************
   *                                                                         *
   * Private                                                                 *
   *                                                                         *
   **************************************************************************/

  private registerInternal(attribute: SearchAttribute): void {
    attribute.valueChanged.subscribe(
      queryValue => this.setAttribute(attribute, queryValue),
      err => this.log.error('Failed to update query for attribute: ' + JSON.stringify(attribute), err)
    );
  }

  private setAttribute(attribute: SearchAttribute, newValue: any): void {

    if (!this.isAttributeValuePresent(newValue)) {
      this._model.delete(attribute);
    } else {
      this._model.set(attribute, newValue);
    }
    this.onModelChanged();
  }

  private onModelChanged(): void {
    this._modelChanged.next(this._model);
  }

  private buildQueryModel(model: Map<SearchAttribute, any>): Map<string, Attribute> {

    const queryModel = new Map<string, Attribute>();

    this.attributes.forEach(attribute => {

      const value = model.get(attribute);

      const hasFallback = (attribute.fallbackValue !== null && attribute.fallbackValue !== undefined);

      let queryValue = null;

      if (this.isAttributeValuePresent(value)) {
        // Attribute value is present
        queryValue = this.resolveValue(attribute, value);
      } else if (hasFallback) {
        queryValue = attribute.fallbackValue;
      }

      if (queryValue !== null) {
        queryModel.set(
          attribute.attribute,
          new Attribute(
            attribute.attribute,
            attribute.queryKey || attribute.attribute,
            queryValue
            )
        );
      }

    });

    return queryModel;
  }

  private isAttributeValuePresent(value: any): boolean {
    return (value !== null && value !== undefined && (value + '').length !== 0);
  }

  private resolveValue(attribute: SearchAttribute, value: any): any {
    value = PropertyPathUtil.resolveValue(value, attribute.valueQueryPath);
    value = attribute.valueQueryTransform ? attribute.valueQueryTransform(value) : value;
    return value;
  }

  private countActiveFilters(model: Map<SearchAttribute, any>, skip: string[]): number {

    return Array.from(model.entries())
      .filter((entry) => skip.findIndex(toSkip => toSkip === entry[0].attribute) === -1) // filter those not to skip
      .filter((entry) => {
        const attribute = entry[0] as SearchAttribute;
        const value = entry[1] as any;
        const include = this.isAttributeValuePresent(value) && attribute.fallbackValue !== value;
        return include;
      })
      .length;
  }

}

