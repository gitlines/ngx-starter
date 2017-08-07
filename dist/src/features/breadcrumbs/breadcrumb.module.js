import { NgModule } from "@angular/core";
import { BreadcrumbComponent } from "./breadcrumb.component";
import { BreadcrumbService } from "./breadcrumb.service";
import { CommonModule } from "@angular/common";
import { MdIconModule } from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule } from "@angular/router";
export { BreadcrumbService } from "./breadcrumb.service";
export { BreadcrumbComponent } from "./breadcrumb.component";
var BreadcrumbModule = (function () {
    function BreadcrumbModule() {
    }
    BreadcrumbModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        BreadcrumbComponent
                    ],
                    providers: [
                        BreadcrumbService
                    ],
                    exports: [
                        BreadcrumbComponent
                    ],
                    imports: [CommonModule, RouterModule, MdIconModule, FlexLayoutModule]
                },] },
    ];
    /** @nocollapse */
    BreadcrumbModule.ctorParameters = function () { return []; };
    return BreadcrumbModule;
}());
export { BreadcrumbModule };
//# sourceMappingURL=breadcrumb.module.js.map