

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DelayedFocusDirective} from './delayed-focus.directive';
import {TouchedDirective} from './touched.directive';
import {FilterInputDirective} from './filter-input.directive';
import {MatFormFieldModule} from '@angular/material';

export {DelayedFocusDirective} from './delayed-focus.directive';
export {TouchedDirective} from './touched.directive';
export {FilterInputDirective} from  './filter-input.directive';

@NgModule({
    declarations: [
        DelayedFocusDirective, TouchedDirective, FilterInputDirective
    ],
    exports : [
        DelayedFocusDirective, TouchedDirective, FilterInputDirective
    ],
    imports : [ CommonModule, MatFormFieldModule ]
})
export class FormSupportDirectivesModule { }
