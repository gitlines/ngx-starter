

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EbsDelayedFocusDirective} from './ebs-delayed-focus.directive';
import {EbsTouchedDirective} from './ebs-touched.directive';
import {EbsFilterInputDirective} from './ebs-filter-input.directive';
import {MatFormFieldModule} from '@angular/material';
import {EbsPlugParentFormDirective} from './ebs-plug-parent-form.directive';

export {EbsDelayedFocusDirective} from './ebs-delayed-focus.directive';
export {EbsTouchedDirective} from './ebs-touched.directive';
export {EbsFilterInputDirective} from './ebs-filter-input.directive';
export {EbsPlugParentFormDirective} from './ebs-plug-parent-form.directive';

@NgModule({
    declarations: [

      EbsDelayedFocusDirective,
      EbsTouchedDirective,
      EbsFilterInputDirective,
      EbsPlugParentFormDirective
    ],
    exports : [

      EbsDelayedFocusDirective,
      EbsTouchedDirective,
      EbsFilterInputDirective,
      EbsPlugParentFormDirective
    ],
    imports : [ CommonModule, MatFormFieldModule ]
})
export class EbsFormSupportDirectivesModule { }
