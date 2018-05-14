
import {ValueAccessorBase} from './value-accessor-base';
import {AbstractControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgForm, ValidationErrors, Validator} from '@angular/forms';
import {forwardRef, Input, OnDestroy, Provider, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';


export function buildFormIntegrationProviders(component: any): Provider[] {
  return [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => component),
    multi: true
  }, {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => component),
    multi: true
  }];
}


/**
 * Provides the ability to expose a (sub) form as a control with validation support.
 * What this means is that a sub form consisting of multiple controls can be nested in a parent form
 * and propagate its validation state up to it.
 *
 * How to use:
 *
 * 1. The sub form must extend from this class.
 * 2. The sub form must be wrapped in a html form and expose the #form variable: <form #form="ngForm" >
 * 3. Must register the NG_VALUE_ACCESSOR +  NG_VALIDATORS providers. (use buildFormIntegrationProviders(MyComponent)
 */
export abstract class TemplateCompositeControl<T> extends ValueAccessorBase<T> implements Validator, OnDestroy {


  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private _sub: Subscription | null;

  private _group: FormGroup;
  private _disabled = false;
  private _validatorChanged: Array<() => void> = [];

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  /***************************************************************************
   *                                                                         *
   * ControlValueAccessor implementation                                     *
   *                                                                         *
   **************************************************************************/


  public validate(c: AbstractControl): ValidationErrors | any {
    if (this.group && !this.group.valid) {
      return {
        composite: 'composite-error'
      };
    }
    return null;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this._validatorChanged.push(fn);
  }

  /***************************************************************************
   *                                                                         *
   * Disabled support                                                        *
   *                                                                         *
   **************************************************************************/

  @Input('disabled')
  public set disabled(isDisabled: boolean) {
    this.setDisabledState(isDisabled);
    this._disabled = isDisabled;
  }

  public get disabled(): boolean { return this._disabled; }

  public setDisabledState(isDisabled: boolean): void {
    if (this.group) {
      Object.keys(this.group.controls).forEach(key => {
        const ctrl = this.group.get(key);
        if (ctrl) {
            if (isDisabled) {
                ctrl.disable();
            } else {
                ctrl.enable();
            }
        }
      });
    }
  }

  /***************************************************************************
   *                                                                         *
   * API for subclasses                                                      *
   *                                                                         *
   **************************************************************************/

  @ViewChild('form')
  public set ngForm(form: NgForm) {
    if (form) {
        this.group = form.form;
    }
  }

  protected set group(group: FormGroup) {
    this._group = group;

    this.unsubscribeAll();

    this._sub = this._group.valueChanges
      .subscribe(newValue => {
        this.onValueChanged(this.value);
      });
  }

  protected get group(): FormGroup {
    return this._group;
  }


  protected onValueChanged(value: T): void {
    super.onValueChanged(value);
    this.emitValidatorChange();
  }

  protected emitValidatorChange(): void {
    this._validatorChanged.forEach(f => f());
  }

  protected writeToControl(value: T): void {
    // NOP - not necessary when using template binding
  }


  private unsubscribeAll(): void {
    if (this._sub) {
      this._sub.unsubscribe();
      this._sub = null;
    }
  }
}
