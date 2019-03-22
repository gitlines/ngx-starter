
import {CommonModule} from '@angular/common';
import {BytesPipe} from './bytes.pipe';
import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {TimeAgoPipe} from './time-ago.pipe';
import {WeightPipe} from './weight.pipe';
import {TimeDurationPipe} from './time-duration.pipe';
import {ElderRepeatPipe} from './elder-repeat.pipe';
import {ElderSafeUrlPipe} from './elder-safe-url.pipe';

export {BytesPipe} from './bytes.pipe';
export {TimeAgoPipe} from './time-ago.pipe';
export {WeightPipe} from './weight.pipe';
export {TimeDurationPipe} from './time-duration.pipe';
export {ElderRepeatPipe} from './elder-repeat.pipe';
export {ElderSafeUrlPipe} from './elder-safe-url.pipe';

/**
 * @deprecated Please switch to ElderRepeatPipe
 */
@Pipe({name: 'ebsRepeat'})
export class ElderRepeatPipeLegacy extends ElderRepeatPipe implements PipeTransform { }

@NgModule({
    declarations: [
        BytesPipe, TimeAgoPipe, TimeDurationPipe, WeightPipe, ElderRepeatPipe, ElderSafeUrlPipe, ElderRepeatPipeLegacy
    ],
    exports : [
        BytesPipe, TimeAgoPipe, TimeDurationPipe, WeightPipe, ElderRepeatPipe, ElderSafeUrlPipe, ElderRepeatPipeLegacy
    ],
    imports : [ CommonModule ]
})
export class ElderPipesModule { }
