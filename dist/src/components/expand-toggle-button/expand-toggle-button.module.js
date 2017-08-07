import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExpandToggleButtonComponent } from "./expand-toggle-button.component";
import { MdButtonModule, MdIconModule } from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";
export { ExpandToggleButtonComponent } from "./expand-toggle-button.component";
var ExpandToggleButtonModule = (function () {
    function ExpandToggleButtonModule() {
    }
    ExpandToggleButtonModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule, MdButtonModule, MdIconModule, FlexLayoutModule
                    ],
                    declarations: [
                        ExpandToggleButtonComponent
                    ],
                    exports: [
                        ExpandToggleButtonComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    ExpandToggleButtonModule.ctorParameters = function () { return []; };
    return ExpandToggleButtonModule;
}());
export { ExpandToggleButtonModule };
//# sourceMappingURL=expand-toggle-button.module.js.map