
import {NgModule} from "@angular/core";
import {BreadcrumbComponent} from "./breadcrumb.component";
import {BreadcrumbService} from "./breadcrumb.service";
import {CommonModule} from "@angular/common";
import {MdIconModule} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
    declarations: [
        BreadcrumbComponent
    ],
    providers: [
        BreadcrumbService
    ],
    exports : [
        BreadcrumbComponent
    ],
    imports : [ CommonModule, MdIconModule, FlexLayoutModule ]
})
export class BreadcrumbModule { }
