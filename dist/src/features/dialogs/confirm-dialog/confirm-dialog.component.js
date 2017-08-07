import { MdDialogRef } from '@angular/material';
import { Component } from '@angular/core';
var ConfirmDialog = (function () {
    function ConfirmDialog(dialogRef) {
        this.dialogRef = dialogRef;
    }
    ConfirmDialog.decorators = [
        { type: Component, args: [{
                    selector: 'confirm-dialog',
                    templateUrl: './confirm-dialog.component.html',
                    styleUrls: ['./confirm-dialog.component.scss'],
                },] },
    ];
    /** @nocollapse */
    ConfirmDialog.ctorParameters = function () { return [
        { type: MdDialogRef, },
    ]; };
    return ConfirmDialog;
}());
export { ConfirmDialog };
//# sourceMappingURL=confirm-dialog.component.js.map