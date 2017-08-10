import { NgModule } from "@angular/core";
import { GlobalSearchComponent } from "./global-search.component";
import { GlobalSearchService } from "./global-search.service";
import { MdButtonModule, MdIconModule, MdInputModule, MdMenuModule } from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
export { GlobalSearchComponent } from "./global-search.component";
export { GlobalSearchService } from "./global-search.service";
var GlobalSearchModule = (function () {
    function GlobalSearchModule() {
    }
    GlobalSearchModule.forRoot = function () {
        return {
            ngModule: GlobalSearchModule,
            providers: [
                {
                    provide: GlobalSearchService,
                    useClass: GlobalSearchService
                },
            ]
        };
    };
    GlobalSearchModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        GlobalSearchComponent
                    ],
                    exports: [
                        GlobalSearchComponent
                    ],
                    imports: [CommonModule, MdIconModule, MdInputModule, MdButtonModule, MdMenuModule, FlexLayoutModule]
                },] },
    ];
    /** @nocollapse */
    GlobalSearchModule.ctorParameters = function () { return []; };
    return GlobalSearchModule;
}());
export { GlobalSearchModule };
//# sourceMappingURL=global-search.module.js.map