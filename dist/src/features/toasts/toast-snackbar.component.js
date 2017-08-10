import { Component } from '@angular/core';
import { MdSnackBar } from "@angular/material";
import { ToastService } from "../toasts/toast.service";
var ToastSnackbarComponent = (function () {
    function ToastSnackbarComponent(toastService, snackBar) {
        this.toastService = toastService;
        this.snackBar = snackBar;
    }
    ToastSnackbarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.toastService.getNotificationsObservable().subscribe(function (notification) {
            _this.snackBar.open(notification.message, "OK", { duration: 3000 });
        });
    };
    ToastSnackbarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-toast',
                    template: ''
                },] },
    ];
    /** @nocollapse */
    ToastSnackbarComponent.ctorParameters = function () { return [
        { type: ToastService, },
        { type: MdSnackBar, },
    ]; };
    return ToastSnackbarComponent;
}());
export { ToastSnackbarComponent };
//# sourceMappingURL=toast-snackbar.component.js.map