

import {NgModule} from "@angular/core";
import {AccessDeniedComponent} from "./access-denied.component";
import {CommonModule} from "@angular/common";

export { AccessDeniedComponent } from "./access-denied.component"

@NgModule({
    declarations: [
        AccessDeniedComponent
    ],
    exports : [
        AccessDeniedComponent
    ],
    imports : [ CommonModule ]
})
export class AccessDeniedModule { }