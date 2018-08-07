

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DelayedFocusDirective} from './delayed-focus.directive';
import {TouchedDirective} from './touched.directive';
import {FilterInputDirective} from './filter-input.directive';
import {MatFormFieldModule} from '@angular/material';
import {PlugParentFormDirective} from './plug-parent-form.directive';

export {DelayedFocusDirective} from './delayed-focus.directive';
export {TouchedDirective} from './touched.directive';
export {FilterInputDirective} from  './filter-input.directive';
export {PlugParentFormDirective} from  './plug-parent-form.directive';

@NgModule({
    declarations: [

      DelayedFocusDirective,
      TouchedDirective,
      FilterInputDirective,
      PlugParentFormDirective
    ],
    exports : [

      DelayedFocusDirective,
      TouchedDirective,
      FilterInputDirective,
      PlugParentFormDirective
    ],
    imports : [ CommonModule, MatFormFieldModule ]
})
export class FormSupportDirectivesModule { }
