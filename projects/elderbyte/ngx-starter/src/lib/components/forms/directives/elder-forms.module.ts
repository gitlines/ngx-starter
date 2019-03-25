

import {CommonModule} from '@angular/common';
import {Directive, NgModule} from '@angular/core';
import {ElderDelayedFocusDirective} from './elder-delayed-focus.directive';
import {ElderTouchedDirective} from './elder-touched.directive';
import {MatFormFieldModule} from '@angular/material';
import {ElderPlugParentFormDirective} from './elder-plug-parent-form.directive';
import {ElderStopEventPropagationDirective} from './elder-stop-event-propagation.directive';
import {ElderSearchModule} from '../search/elder-search.module';


export {ElderDelayedFocusDirective} from './elder-delayed-focus.directive';
export {ElderTouchedDirective} from './elder-touched.directive';
export {ElderPlugParentFormDirective} from './elder-plug-parent-form.directive';
export {ElderStopEventPropagationDirective} from './elder-stop-event-propagation.directive';

/**
 * @deprecated Please switch to ElderTouchedDirective
 */
@Directive({ selector: '[touched]' })
export class ElderTouchedDirectiveLegacy extends ElderTouchedDirective { }

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
  imports : [ CommonModule, MatFormFieldModule, ElderSearchModule ],
  declarations: [
    ElderDelayedFocusDirective,
    ElderTouchedDirective, ElderTouchedDirectiveLegacy,
    ElderPlugParentFormDirective, ElderPlugParentFormDirectiveLegacy,
    ElderStopEventPropagationDirective, ElderStopEventPropagationDirectiveLegacy,
  ],
  exports : [

    ElderDelayedFocusDirective,
    ElderTouchedDirective, ElderTouchedDirectiveLegacy,
    ElderPlugParentFormDirective, ElderPlugParentFormDirectiveLegacy,
    ElderStopEventPropagationDirective, ElderStopEventPropagationDirectiveLegacy
  ],
})
export class ElderFormsModule { }
