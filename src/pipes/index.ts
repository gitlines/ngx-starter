
import {CommonModule} from '@angular/common';
import {BytesPipe} from './bytes.pipe';
import {NgModule} from '@angular/core';
import {TimeAgoPipe} from './time-ago.pipe';
import {WeightPipe} from './weight.pipe';

export {BytesPipe} from './bytes.pipe'
export {TimeAgoPipe} from './time-ago.pipe'
export {WeightPipe} from './weight.pipe'


@NgModule({
    declarations: [
        BytesPipe, TimeAgoPipe, WeightPipe
    ],
    exports : [
        BytesPipe, TimeAgoPipe, WeightPipe
    ],
    imports : [ CommonModule ]
})
export class CommonPipesModule { }
