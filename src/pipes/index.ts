
import {CommonModule} from '@angular/common';
import {BytesPipe} from './bytes.pipe';
import {NgModule} from '@angular/core';
import {TimeAgoPipe} from './time-ago.pipe';
import {WeightPipe} from './weight.pipe';
import {TimeDurationPipe} from './time-duration.pipe';

export {BytesPipe} from './bytes.pipe'
export {TimeAgoPipe} from './time-ago.pipe'
export {WeightPipe} from './weight.pipe'
export {TimeDurationPipe} from './time-duration.pipe'

@NgModule({
    declarations: [
        BytesPipe, TimeAgoPipe, TimeDurationPipe, WeightPipe
    ],
    exports : [
        BytesPipe, TimeAgoPipe, TimeDurationPipe, WeightPipe
    ],
    imports : [ CommonModule ]
})
export class CommonPipesModule { }
