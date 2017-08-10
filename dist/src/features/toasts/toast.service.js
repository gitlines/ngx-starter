import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { ToastType } from "./toast-type";
import { TranslateService } from "@ngx-translate/core";
export * from "./toast-type";
var ToastService = (function () {
    function ToastService(translate) {
        this.translate = translate;
        this.subjet = new Subject();
    }
    ToastService.prototype.getNotificationsObservable = function () {
        return this.subjet.asObservable();
    };
    ToastService.prototype.pushNotification = function (msg) {
        this.subjet.next(msg);
    };
    ToastService.prototype.pushInfoRaw = function (msg) {
        this.pushInfoToast(msg);
    };
    ToastService.prototype.pushInfo = function (msgKey, interpolateParams) {
        var _this = this;
        this.translateMessage(msgKey, interpolateParams).subscribe(function (res) { return _this.pushInfoToast(res); }, function (err) { return _this.pushInfoToast(msgKey); }); // no translation found, push key
    };
    ToastService.prototype.pushErrorRaw = function (msg, error) {
        console.error(msg, error);
        this.pushInfoToast(msg);
    };
    ToastService.prototype.pushError = function (msgKey, interpolateParams, error) {
        var _this = this;
        this.translateMessage(msgKey, interpolateParams).subscribe(function (res) {
            console.error(res, error);
            _this.pushErrorToast(res);
        }, function (err) { return _this.pushErrorToast(msgKey); }); // no translation found, push key
    };
    ToastService.prototype.pushInfoToast = function (msg) {
        this.subjet.next({
            message: msg,
            type: ToastType.Success
        });
    };
    ToastService.prototype.pushErrorToast = function (msg) {
        this.subjet.next({
            message: msg,
            type: ToastType.Error
        });
    };
    ToastService.prototype.translateMessage = function (msg, interpolateParams) {
        return this.translate.get(msg, interpolateParams);
    };
    ToastService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ToastService.ctorParameters = function () { return [
        { type: TranslateService, },
    ]; };
    return ToastService;
}());
export { ToastService };
//# sourceMappingURL=toast.service.js.map