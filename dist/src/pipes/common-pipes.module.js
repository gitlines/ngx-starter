import { CommonModule } from "@angular/common";
import { BytesPipe } from "./bytes.pipe";
import { NgModule } from "@angular/core";
import { TimeAgoPipe } from "./time-ago.pipe";
var CommonPipesModule = (function () {
    function CommonPipesModule() {
    }
    CommonPipesModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        BytesPipe, TimeAgoPipe
                    ],
                    exports: [
                        BytesPipe, TimeAgoPipe
                    ],
                    imports: [CommonModule]
                },] },
    ];
    /** @nocollapse */
    CommonPipesModule.ctorParameters = function () { return []; };
    return CommonPipesModule;
}());
export { CommonPipesModule };
//# sourceMappingURL=common-pipes.module.js.map