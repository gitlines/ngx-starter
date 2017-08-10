import { NgModule } from "@angular/core";
import { InfiniteScrollDirective } from "./infinite-scroll.directive";
import { CommonModule } from "@angular/common";
export { InfiniteScrollDirective } from "./infinite-scroll.directive";
var InfiniteScrollModule = (function () {
    function InfiniteScrollModule() {
    }
    InfiniteScrollModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        InfiniteScrollDirective
                    ],
                    exports: [
                        InfiniteScrollDirective
                    ],
                    imports: [CommonModule]
                },] },
    ];
    /** @nocollapse */
    InfiniteScrollModule.ctorParameters = function () { return []; };
    return InfiniteScrollModule;
}());
export { InfiniteScrollModule };
//# sourceMappingURL=infinite-scroll.module.js.map