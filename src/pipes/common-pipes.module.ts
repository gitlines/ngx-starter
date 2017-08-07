
import {CommonModule} from "@angular/common";
import {BytesPipe} from "./bytes.pipe";
import {NgModule} from "@angular/core";
import {TimeAgoPipe} from "./time-ago.pipe";


@NgModule({
    declarations: [
        BytesPipe, TimeAgoPipe
    ],
    exports : [
        BytesPipe, TimeAgoPipe
    ],
    imports : [ CommonModule ]
})
export class CommonPipesModule { }