import {
  AfterViewInit,
  Directive, Host,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LoggerFactory } from '@elderbyte/ts-logger';
import { ElderSearchContextDirective } from './elder-search-context.directive';
import { Observable } from 'rxjs/internal/Observable';
import { NgModel } from '@angular/forms';
import {SearchInput} from './model/search-input';
import {filter, map, startWith, takeUntil} from 'rxjs/operators';
import {PropertyPathUtil} from '../../../common/utils/property-path-util';
import {BehaviorSubject, Subject} from 'rxjs';
import {SearchInputState} from './model/search-input-state';

/**
 * Search name adapter for input controls.
 */
@Directive({
  selector: '[elderSearchInput]',
  exportAs: 'elderSearchInput'
})
export class ElderSearchInputDirective implements OnInit, OnDestroy, AfterViewInit, SearchInput {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderSearchInputDirective');

  private readonly _state = new BehaviorSubject<SearchInputState>(null);

  private _extractedName: string | null;

  private readonly unsubscribe$ = new Subject();

  /**
   * (Optional) Usually the control name is used, this allows a custom query key
   */
  @Input('elderSearchInputKey')
  public queryKey: string;

  /**
   * (Optional) Function which transforms the value object to a query param value
   */
  @Input('elderSearchInputTransform')
  public valueTransform: ((value: any) => any);

  /**
   * (Optional, Default) Path on the value object to use as query param value
   *  value = "type.id"
   */
  @Input('elderSearchInput')
  public resolvePath: string;

  /**
   * (Optional) Use this value for the query if none is provided.
   */
  @Input('elderSearchInputFallback')
  public fallbackValue: string;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private searchContext: ElderSearchContextDirective,
    @Host() private ngModel: NgModel
  ) {
  }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                             *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void { }

  public ngAfterViewInit(): void {
    this._extractedName = this.extractName();

    this.searchContext.register(this);

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

  public get state$(): Observable<SearchInputState> {
    return this._state.asObservable().pipe(
      filter(s => !!s)
    );
  }

  public get stateSnapshot(): SearchInputState {
    return this._state.getValue();
  }

  public get name(): string {
    if (this.queryKey) { return this.queryKey; }
    if (this._extractedName) { return this._extractedName; }

    throw new Error('Could not determine the search name key name.' +
      ' Either specify the name property or explicitly set [elderSearchInputKey].');
  }

  public get value(): any {
    return this.ngModel.value;
  }

  public get readonly(): boolean {
    return this.ngModel.isDisabled;
  }

  private get hasFallback(): boolean {
    return (this.fallbackValue !== null && this.fallbackValue !== undefined);
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

  private stateObservable(): Observable<SearchInputState> {
    return this.ngModel.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      startWith(this.ngModel.value),
      map(value => {

        const queryValue = this.convertRawModelValueToQueryString(value);
        const pristine = !this.isAttributeValuePresent(value);

        return new SearchInputState(
          this.name,
          queryValue,
          this.queryKey || this.name,
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
        queryValue = this.fallbackValue;
      }
    }
    return queryValue;
  }

  private emitState(state: SearchInputState): void {
    this._state.next(state);
  }

  private isAttributeValuePresent(value: any): boolean {
    return (value !== null && value !== undefined && (value + '').length !== 0);
  }

  private resolveValue(value: any): any {
    value = PropertyPathUtil.resolveValue(value, this.resolvePath);
    value = this.valueTransform ? this.valueTransform(value) : value;
    return value;
  }

  private extractName(): string | null {
    return this.ngModel.name;
  }

}
