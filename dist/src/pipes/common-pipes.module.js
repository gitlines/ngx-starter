import { CommonModule } from "@angular/common";
import { BytesPipe } from "./bytes.pipe";
import { NgModule } from "@angular/core";
var CommonPipesModule = (function () {
    function CommonPipesModule() {
    }
    CommonPipesModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        BytesPipe
                    ],
                    exports: [
                        BytesPipe
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