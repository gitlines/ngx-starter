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
import { Subscription } from 'rxjs/internal/Subscription';
import { SearchAttribute } from './search-attribute';

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

  private _extractedName: string | null;

  private _sub: Subscription;

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

  public get attribute(): string {
    if (this.searchInputKey) { return this.searchInputKey; }
    if (this._extractedName) { return this._extractedName; }

    throw new Error('Could not determine the search attribute key name.' +
      ' Either specify the name property or explicitly set filterInputKey.');
  }

  public get valueChanged(): Observable<any> {
    return this.ngModel.valueChanges;
  }


  public get value(): any {
    return this.ngModel.value;
  }

  public get readonly(): boolean {
    return this.ngModel.isDisabled;
  }

  public get valueQueryPath(): string {
    return this.searchInputPath;
  }

  public get valueQueryTransform(): (value: any) => any {
    return this.searchInputValueTransform;
  }

  public get fallbackValue(): any {
    return this.searchInputFallbackValue;
  }
  // TODO readonly queryKey: string;

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

  private extractName(): string | null {
    return this.ngModel.name;
  }

}
