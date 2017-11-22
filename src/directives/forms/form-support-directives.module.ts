

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DelayedFocusDirective} from './delayed-focus.directive';
import {TouchedDirective} from './touched.directive';

export {DelayedFocusDirective} from './delayed-focus.directive'
export {TouchedDirective} from './touched.directive'


@NgModule({
    declarations: [
        DelayedFocusDirective, TouchedDirective
    ],
    exports : [
        DelayedFocusDirective, TouchedDirective
    ],
    imports : [ CommonModule ]
})
export class FormSupportDirectivesModule { }
