import {
  AfterViewInit,
  Directive, Host,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LoggerFactory } from '@elderbyte/ts-logger';
import { ElderSearchModelDirective } from './elder-search-model.directive';
import { Observable } from 'rxjs/internal/Observable';
import { NgModel } from '@angular/forms';
import {SearchAttribute, SearchAttributeState} from './search-attribute';
import {filter, map, startWith, takeUntil} from 'rxjs/operators';
import {PropertyPathUtil} from '../../../common/utils/property-path-util';
import {BehaviorSubject, Subject} from 'rxjs';

/**
 * Search attribute adapter for input controls.
 */
@Directive({
  selector: '[elderSearchInput]'
})
export class ElderSearchInputDirective implements OnInit, OnDestroy, AfterViewInit, SearchAttribute {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderSearchInputDirective');

  private readonly _state = new BehaviorSubject<SearchAttributeState>(null);

  private _extractedName: string | null;

  private readonly unsubscribe$ = new Subject();

  /**
   * (Optional) The query param key
   */
  @Input() public searchInputKey: string;

  /**
   * (Optional) Function which transforms the value object to a query param value
   */
  @Input() public searchInputValueTransform: ((value: any) => any);

  /**
   * (Optional) Path on the value object to use as query param value
   *  value = "type.id"
   */
  @Input() public searchInputPath: string;

  /**
   * (Optional) Use this value for the query if none is provided.
   */
  @Input() public searchInputFallbackValue: string;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private searchContainer: ElderSearchModelDirective,
    @Host() private ngModel: NgModel
  ) {
    this.logger.trace('ngModel:',  ngModel);
    this.searchContainer.register(this);
  }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                             *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void { }

  public ngAfterViewInit(): void {
    this._extractedName = this.extractName();

    this.stateObservable().subscribe(state => {
      this.emitState(state);
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

  public get state$(): Observable<SearchAttributeState> {
    return this._state.asObservable().pipe(
      filter(s => !!s)
    );
  }

  public get stateSnapshot(): SearchAttributeState {
    return this._state.getValue();
  }

  public get attribute(): string {
    if (this.searchInputKey) { return this.searchInputKey; }
    if (this._extractedName) { return this._extractedName; }

    throw new Error('Could not determine the search attribute key name.' +
      ' Either specify the name property or explicitly set filterInputKey.');
  }

  public get value(): any {
    return this.ngModel.value;
  }

  public get readonly(): boolean {
    return this.ngModel.isDisabled;
  }

  private get hasFallback(): boolean {
    return (this.searchInputFallbackValue !== null && this.searchInputFallbackValue !== undefined);
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public reset(): void {
    this.ngModel.reset();
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private stateObservable(): Observable<SearchAttributeState> {
    return this.ngModel.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      startWith(this.ngModel.value),
      map(value => {

        const queryValue = this.convertRawModelValueToQueryString(value);
        const pristine = !this.isAttributeValuePresent(value);

        return new SearchAttributeState(
          this.attribute,
          queryValue,
          this.searchInputKey || this.attribute,
          pristine
        );
      })
    );
  }

  private convertRawModelValueToQueryString(model: any): string | null {

    let queryValue: string = null;

    if (this.isAttributeValuePresent(model)) {
      // Attribute value is present
      queryValue = this.resolveValue(model);
    } else {
      if (this.hasFallback) {
        queryValue = this.searchInputFallbackValue;
      }
    }
    return queryValue;
  }

  private emitState(state: SearchAttributeState): void {
    this._state.next(state);
  }

  private isAttributeValuePresent(value: any): boolean {
    return (value !== null && value !== undefined && (value + '').length !== 0);
  }

  private resolveValue(value: any): any {
    value = PropertyPathUtil.resolveValue(value, this.searchInputPath);
    value = this.searchInputValueTransform ? this.searchInputValueTransform(value) : value;
    return value;
  }

  private extractName(): string | null {
    return this.ngModel.name;
  }

}
