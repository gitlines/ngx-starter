import { ConfirmDialog } from './confirm-dialog/confirm-dialog.component';
import { MdDialog } from '@angular/material';
import { Injectable } from '@angular/core';
var CommonDialogService = (function () {
    function CommonDialogService(dialog) {
        this.dialog = dialog;
    }
    CommonDialogService.prototype.confirm = function (title, message) {
        var dialogRef;
        dialogRef = this.dialog.open(ConfirmDialog);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        return dialogRef.afterClosed();
    };
    CommonDialogService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CommonDialogService.ctorParameters = function () { return [
        { type: MdDialog, },
    ]; };
    return CommonDialogService;
}());
export { CommonDialogService };
//# sourceMappingURL=common-dialog.service.js.map