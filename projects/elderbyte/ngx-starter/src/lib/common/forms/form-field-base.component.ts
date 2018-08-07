import { Input } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import {ValueAccessorBase} from './value-accessor-base';

export abstract class FormFieldBaseComponent<T> extends ValueAccessorBase<T> implements Validator {

  /* *************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  /**
   * Control name.
   */
  @Input()
  public name: string;

  @Input()
  public placeholder: string;

  @Input()
  public hint: string;

  @Input()
  public showHint = false;

  /**
   * Icon displayed as form field prefix.
   */
  @Input()
  public icon: string;

  @Input()
  public showIcon = true;

  /**
   * If true, control will not show selection dialog.
   */
  @Input()
  public readonly = false;

  @Input()
  public disabled = false;

  @Input()
  public required = false;

  public get isLocked(): boolean {
    return this.disabled || this.readonly;
  }

  /* *************************************************************************
   *                                                                         *
   * ControlValueAccessor API                                                *
   *                                                                         *
   **************************************************************************/

  protected writeToControl(value: T): void {
  }

  /* *************************************************************************
   *                                                                         *
   * Validator API                                                           *
   *                                                                         *
   **************************************************************************/

  public validate(c: AbstractControl): ValidationErrors | null {

    let result = null;

    if (this.required && !this.value) {
      result = {
        required: { valid: false }
      };
    }

    return result;

  }

}
