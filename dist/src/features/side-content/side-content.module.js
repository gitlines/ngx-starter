import { NgModule } from "@angular/core";
import { SideContentToggleComponent } from "./side-content-toggle/side-content-toggle.component";
import { SideContentService } from "./side-content.service";
import { CommonModule } from "@angular/common";
import { MdButtonModule, MdIconModule } from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";
export * from "./side-content.service";
export * from "./side-content-toggle/side-content-toggle.component";
var SideContentModule = (function () {
    function SideContentModule() {
    }
    SideContentModule.forRoot = function () {
        return {
            ngModule: SideContentModule,
            providers: [
                {
                    provide: SideContentService,
                    useClass: SideContentService
                },
            ]
        };
    };
    SideContentModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        SideContentToggleComponent
                    ],
                    exports: [
                        SideContentToggleComponent
                    ],
                    imports: [CommonModule, MdIconModule, MdButtonModule, FlexLayoutModule]
                },] },
    ];
    /** @nocollapse */
    SideContentModule.ctorParameters = function () { return []; };
    return SideContentModule;
}());
export { SideContentModule };
//# sourceMappingURL=side-content.module.js.map