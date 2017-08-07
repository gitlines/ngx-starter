
import {CommonModule} from "@angular/common";
import {BytesPipe} from "./bytes.pipe";
import {NgModule} from "@angular/core";


@NgModule({
    declarations: [
        BytesPipe
    ],
    exports : [
        BytesPipe
    ],
    imports : [ CommonModule ]
})
export class CommonPipesModule { }