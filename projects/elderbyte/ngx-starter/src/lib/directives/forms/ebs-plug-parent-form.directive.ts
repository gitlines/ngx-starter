import { Directive } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

/**
 * This directive provides a parent form to any kind of nested control
 * container, like in nested components. This means that form elements
 * brought in by included components will be respected by parent forms,
 * e.g. for validation.
 */
@Directive({
  selector: '[plugParentForm]',
  providers: [
    {
      provide: ControlContainer,
      useFactory: provideForm,
      deps: [NgForm]
    }
  ]
})
export class EbsPlugParentFormDirective {
}

export function provideForm(form: NgForm) {
  return form;
}
