import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import {BehaviorSubject} from 'rxjs';

/**
 * Immutable representation of the state of an attribute
 */
export class SearchAttributeState {
  constructor(

    /**
     * attribute The attribute name
     */
    public readonly attribute: string,

    /**
     * queryValue The query value
     */
    public readonly queryValue: string | null,
    /**
     * queryKey The query key
     */
    public readonly queryKey: string,

    /**
     * pristine Has the user touched this?
     */
    public readonly pristine: boolean
  ) { }

  public get hasValue(): boolean { return !!this.queryValue; }

  public withQueryValue(value: string | null, pristine?: boolean): SearchAttributeState {

    let pristineNow = value == null;
    if (!pristineNow) {
      if (pristine !== undefined && pristine !== null) {
        pristineNow = pristine;
      }
    }

    return new SearchAttributeState(
      this.attribute,
      value,
      this.queryKey,
      pristineNow
    );
  }

}

/**
 * Represents a single search attribute.
 */
export interface SearchAttribute {

  /**
   * The attribute name
   */
  readonly attribute: string;

  readonly state$: Observable<SearchAttributeState>;

  readonly stateSnapshot: SearchAttributeState;

  /**
   * States if the search attribute is cannot be changed.
   */
  readonly readonly?: boolean;

  /**
   * Reset the attribute value
   */
  reset(): void;
}

export class SimpleSearchAttribute implements SearchAttribute {

  private readonly _state: BehaviorSubject<SearchAttributeState>;
  private readonly _resetRequest = new Subject<any>();

  constructor(
    public attribute: string,
    public queryKey?: string,
    private _readonly?: boolean
  ) {
    this._state = new BehaviorSubject(
      new SearchAttributeState(
        attribute,
        null,
        queryKey || attribute,
        true
      )
    );
  }

  public set value(value: string) {
    this._state.next(
      this.stateSnapshot.withQueryValue(value ? value : null)
    );
  }

  public get state$(): Observable<SearchAttributeState> {
    return this._state.asObservable();
  }

  public get stateSnapshot(): SearchAttributeState {
    return this._state.getValue();
  }

  public get resetRequest(): Observable<any> {
    return this._resetRequest;
  }

  public get readonly(): boolean {
    return this._readonly;
  }

  public reset(): void {
    this._resetRequest.next();
  }
}
