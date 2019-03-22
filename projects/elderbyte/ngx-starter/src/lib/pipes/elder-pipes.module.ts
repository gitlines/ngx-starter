
import {CommonModule} from '@angular/common';
import {BytesPipe} from './bytes.pipe';
import {NgModule} from '@angular/core';
import {TimeAgoPipe} from './time-ago.pipe';
import {WeightPipe} from './weight.pipe';
import {TimeDurationPipe} from './time-duration.pipe';
import {RepeatPipe} from './repeat.pipe';
import {ElderSafeUrlPipe} from './ebs-safe-url.pipe';

export {BytesPipe} from './bytes.pipe';
export {TimeAgoPipe} from './time-ago.pipe';
export {WeightPipe} from './weight.pipe';
export {TimeDurationPipe} from './time-duration.pipe';
export {RepeatPipe} from './repeat.pipe';
export {ElderSafeUrlPipe} from './ebs-safe-url.pipe';

@NgModule({
    declarations: [
        BytesPipe, TimeAgoPipe, TimeDurationPipe, WeightPipe, RepeatPipe, ElderSafeUrlPipe
    ],
    exports : [
        BytesPipe, TimeAgoPipe, TimeDurationPipe, WeightPipe, RepeatPipe, ElderSafeUrlPipe
    ],
    imports : [ CommonModule ]
})
export class ElderPipesModule { }
