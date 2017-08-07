
import {NgModule} from "@angular/core";
import {BreadcrumbComponent} from "./breadcrumb.component";
import {BreadcrumbService} from "./breadcrumb.service";
import {CommonModule} from "@angular/common";
import {MdIconModule} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import {RouterModule} from "@angular/router";


export { BreadcrumbService  } from "./breadcrumb.service";
export { BreadcrumbComponent  } from "./breadcrumb.component";


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
    imports : [ CommonModule, RouterModule, MdIconModule, FlexLayoutModule ]
})
export class BreadcrumbModule { }
