import { CommonModule } from "@angular/common";
import { ErrorHandler, NgModule } from "@angular/core";
import { GeneralErrorHandler } from "./general-error-handler";
var ErrorHandlerModule = (function () {
    function ErrorHandlerModule() {
    }
    ErrorHandlerModule.forRoot = function () {
        return {
            ngModule: ErrorHandlerModule,
            providers: [
                {
                    provide: ErrorHandler,
                    useClass: GeneralErrorHandler
                },
            ]
        };
    };
    ErrorHandlerModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                },] },
    ];
    /** @nocollapse */
    ErrorHandlerModule.ctorParameters = function () { return []; };
    return ErrorHandlerModule;
}());
export { ErrorHandlerModule };
//# sourceMappingURL=error-handler.module.js.map