
import {Directive, OnInit} from '@angular/core';
import {AbstractControl, NgControl} from '@angular/forms';


/**
 * Applied to an form input, marks this control touched from the beginning.
 * This has the effect that validation will run its course from the start.
 */
@Directive({
  selector: '[elderTouched]'
})
export class ElderTouchedDirective implements OnInit {

  constructor(
    private ngControl: NgControl) {
  }

  ngOnInit(): void {
    if (this.ngControl && this.ngControl.control) {
      const control: AbstractControl = this.ngControl.control;
      control.markAsTouched();
    }
  }
}
