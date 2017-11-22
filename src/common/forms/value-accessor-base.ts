
import {ControlValueAccessor} from '@angular/forms';

/**
 * Manages the control value event handlers
 */
export abstract class ValueAccessorBase<T> implements ControlValueAccessor {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private _innerValue: T;
  private _changed: Array<(value: T) => void> = [];
  private _touched: Array<() => void> = [];


  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get value(): T {
    return this._innerValue;
  }

  public set value(value: T) {
    if (this._innerValue !== value) {
      this._innerValue = value;
      this.onValueChanged(value);
    }
  }

  /***************************************************************************
   *                                                                         *
   * ControlValueAccessor implementation                                     *
   *                                                                         *
   **************************************************************************/

  public writeValue(value: T) {
    this.value = value;
    this.writeToControl(value);
  }


  public registerOnChange(fn: (value: T) => void) {
    this._changed.push(fn);
  }


  public registerOnTouched(fn: () => void) {
    this._touched.push(fn);
  }

  /***************************************************************************
   *                                                                         *
   * API for subclasses                                                      *
   *                                                                         *
   **************************************************************************/

  protected onValueChanged(value: T): void {
    this.emitOnChanged(value);
    this.emitOnTouch();
  }

  protected emitOnTouch(): void {
    this._touched.forEach(f => f());
  }

  protected emitOnChanged(value: T): void {
    this._changed.forEach(f => f(value));
  }

  protected abstract writeToControl(value: T): void;
}
