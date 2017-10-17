
import {Directive} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';


/**
 * The container factory.
 * Note: This code needs to be here and not in the module file because of AOT limitations.
 * @param {NgForm} form
 * @returns {NgForm}
 */
export function containerFactory(form: NgForm) {
  return form;
}

/**
 * This directive enables the lookup of the parent form outside
 * of the current component, effectively supporting nested forms including validation.
 *
 * Add this directive to the nested form child. This child will then auto register itself
 * with any parent form.
 *
 */
@Directive({
  selector: '[provideParentForm]',
  providers: [
    {
      provide: ControlContainer,
      useFactory: containerFactory,
      deps: [NgForm]
    }
  ]
})
export class ProvideParentFormDirective {}
