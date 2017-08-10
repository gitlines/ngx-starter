import { Observable } from "rxjs";
import { Toast } from "./toast";
import { TranslateService } from "@ngx-translate/core";
export * from "./toast";
export * from "./toast-type";
export declare class ToastService {
    private translate;
    private subjet;
    constructor(translate: TranslateService);
    getNotificationsObservable(): Observable<Toast>;
    pushNotification(msg: Toast): void;
    pushInfoRaw(msg: string): void;
    pushInfo(msgKey: string, interpolateParams?: Object): void;
    pushErrorRaw(msg: string, error?: any): void;
    pushError(msgKey: string, interpolateParams?: any, error?: any): void;
    private pushInfoToast(msg);
    private pushErrorToast(msg);
    private translateMessage(msg, interpolateParams);
}
