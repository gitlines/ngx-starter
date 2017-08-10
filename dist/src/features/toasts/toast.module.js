import { NgModule } from "@angular/core";
import { ToastSnackbarComponent } from "./toast-snackbar.component";
import { ToastService } from "./toast.service";
import { CommonModule } from "@angular/common";
import { MdSnackBarModule } from "@angular/material";
export * from "./toast-snackbar.component";
export * from "./toast.service";
var ToastModule = (function () {
    function ToastModule() {
    }
    ToastModule.forRoot = function () {
        return {
            ngModule: ToastModule,
            providers: [
                {
                    provide: ToastService,
                    useClass: ToastService
                }
            ]
        };
    };
    ToastModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        ToastSnackbarComponent
                    ],
                    providers: [
                        ToastService
                    ],
                    exports: [
                        ToastSnackbarComponent
                    ],
                    imports: [CommonModule, MdSnackBarModule]
                },] },
    ];
    /** @nocollapse */
    ToastModule.ctorParameters = function () { return []; };
    return ToastModule;
}());
export { ToastModule };
//# sourceMappingURL=toast.module.js.map