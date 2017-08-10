import { NgModule } from "@angular/core";
import { ToolbarTitleComponent } from "./toolbar-title.component";
import { ToolbarService } from "./toolbar.service";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
export * from "./toolbar-title.component";
export * from "./toolbar.service";
var ToolbarModule = (function () {
    function ToolbarModule() {
    }
    ToolbarModule.forRoot = function () {
        return {
            ngModule: ToolbarModule,
            providers: [
                {
                    provide: ToolbarService,
                    useClass: ToolbarService
                },
            ]
        };
    };
    ToolbarModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule, TranslateModule
                    ],
                    declarations: [
                        ToolbarTitleComponent
                    ],
                    exports: [
                        ToolbarTitleComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    ToolbarModule.ctorParameters = function () { return []; };
    return ToolbarModule;
}());
export { ToolbarModule };
//# sourceMappingURL=toolbar.module.js.map