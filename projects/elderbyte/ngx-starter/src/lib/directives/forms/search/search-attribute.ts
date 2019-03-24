import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';


/**
 * Represents a single search attribute.
 */
export interface SearchAttribute {

  /**
   * The attribute name
   */
  readonly attribute: string;

  /**
   * Occurs when the values changes
   */
  readonly valueChanged: Observable<any>;

  /**
   * Gets the current model value of this attribute
   */
  readonly value: any;

  /**
   * A custom query key if it is different from the attribute name.
   */
  readonly queryKey?: string;

  /**
   * A function which transforms the model value into a query string
   */
  readonly valueQueryTransform?: ((value: any) => any);

  /**
   * A sub path which resolves to the value on the model to use in a query
   */
  readonly valueQueryPath?: string;

  readonly fallbackValue?: any;

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

  private _valueChange = new Subject<any>();
  private _resetRequest = new Subject<any>();
  private _value: any;

  constructor(
    public attribute: string,
    public queryKey?: string,
    public fallbackValue?: any,
    public valueQueryPath?: string,
    public valueQueryTransform?: (value: any) => any,
    private _readonly?: boolean
  ) {

  }

  public get value(): any { return this._value; }

  public set value(value: any) {
    this._value = value;
    this._valueChange.next(value);
  }

  public get valueChanged(): Observable<any> {
    return this._valueChange;
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
