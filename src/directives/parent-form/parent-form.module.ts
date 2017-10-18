import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {containerFactory, ProvideParentFormDirective} from './provide-parent-form.directive';
import {ControlContainer, FormsModule, NgForm} from '@angular/forms';

export * from './provide-parent-form.directive'


@NgModule({
  imports: [
    CommonModule, FormsModule
  ],
  providers: [
    {
      provide: ControlContainer,
      useFactory: containerFactory,
      deps: [NgForm]
    }
  ],
  declarations: [ProvideParentFormDirective],
  exports: [ProvideParentFormDirective]
})
export class ParentFormModule { }
