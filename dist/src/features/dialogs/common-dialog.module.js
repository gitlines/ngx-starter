import { CommonDialogService } from './common-dialog.service';
import { NgModule } from '@angular/core';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog.component';
import { MdButtonModule, MdDialogModule } from "@angular/material";
import { TranslateModule } from "@ngx-translate/core";
export { CommonDialogService } from "./common-dialog.service";
export { ConfirmDialog } from "./confirm-dialog/confirm-dialog.component";
var CommonDialogModule = (function () {
    function CommonDialogModule() {
    }
    CommonDialogModule.forRoot = function () {
        return {
            ngModule: CommonDialogModule,
            providers: [
                {
                    provide: CommonDialogService,
                    useClass: CommonDialogService
                },
            ]
        };
    };
    CommonDialogModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        TranslateModule,
                        MdDialogModule,
                        MdButtonModule
                    ],
                    exports: [
                        ConfirmDialog,
                    ],
                    declarations: [
                        ConfirmDialog,
                    ],
                    entryComponents: [
                        ConfirmDialog
                    ],
                },] },
    ];
    /** @nocollapse */
    CommonDialogModule.ctorParameters = function () { return []; };
    return CommonDialogModule;
}());
export { CommonDialogModule };
//# sourceMappingURL=common-dialog.module.js.map