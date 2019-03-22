

import {CommonModule} from '@angular/common';
import {Directive, NgModule} from '@angular/core';
import {ElderDelayedFocusDirective} from './elder-delayed-focus.directive';
import {ElderTouchedDirective} from './elder-touched.directive';
import {ElderFilterInputDirective} from './elder-filter-input.directive';
import {MatFormFieldModule} from '@angular/material';
import {ElderPlugParentFormDirective} from './elder-plug-parent-form.directive';
import {ElderStopEventPropagationDirective} from './elder-stop-event-propagation.directive';

export {ElderDelayedFocusDirective} from './elder-delayed-focus.directive';
export {ElderTouchedDirective} from './elder-touched.directive';
export {ElderFilterInputDirective} from './elder-filter-input.directive';
export {ElderPlugParentFormDirective} from './elder-plug-parent-form.directive';
export {ElderStopEventPropagationDirective} from './elder-stop-event-propagation.directive';


/**
 * @deprecated Please switch to ElderTouchedDirective
 */
@Directive({ selector: '[touched]' })
export class ElderTouchedDirectiveLegacy extends ElderTouchedDirective { }

/**
 * @deprecated Please switch to ElderFilterInputDirective
 */
@Directive({ selector: '[filterInput]' })
export class ElderFilterInputDirectiveLegacy extends ElderFilterInputDirective { }

/**
 * @deprecated Please switch to ElderPlugParentFormDirective
 */
@Directive({ selector: '[plugParentForm]' })
export class ElderPlugParentFormDirectiveLegacy extends ElderPlugParentFormDirective { }

/**
 * @deprecated Please switch to ElderStopEventPropagationDirective
 */
@Directive({ selector: '[ebsStopEventPropagation]' })
export class ElderStopEventPropagationDirectiveLegacy extends ElderStopEventPropagationDirective { }

@NgModule({
    declarations: [

      ElderDelayedFocusDirective,
      ElderTouchedDirective, ElderTouchedDirectiveLegacy,
      ElderFilterInputDirective, ElderFilterInputDirectiveLegacy,
      ElderPlugParentFormDirective, ElderPlugParentFormDirectiveLegacy,
      ElderStopEventPropagationDirective, ElderStopEventPropagationDirectiveLegacy
    ],
    exports : [

      ElderDelayedFocusDirective,
      ElderTouchedDirective, ElderTouchedDirectiveLegacy,
      ElderFilterInputDirective, ElderFilterInputDirectiveLegacy,
      ElderPlugParentFormDirective, ElderPlugParentFormDirectiveLegacy,
      ElderStopEventPropagationDirective, ElderStopEventPropagationDirectiveLegacy
    ],
    imports : [ CommonModule, MatFormFieldModule ]
})
export class ElderFormsModule { }
