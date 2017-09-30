import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Toast} from './toast';
import {ToastType} from './toast-type';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

export * from './toast';
export * from './toast-type';


@Injectable()
export class ToastService {

  private subjet = new Subject<Toast>();

  constructor(
      private logger: NGXLogger,
      private translate: TranslateService
  ) {}

  getNotificationsObservable(): Observable<Toast> {
    return this.subjet.asObservable();
  }

  pushNotification(msg: Toast) {
    this.subjet.next(msg);
  }

  public pushInfoRaw(msg: string) {
      this.pushInfoToast(msg);
  }

  public pushInfo(msgKey: string, interpolateParams?: Object) {
      this.translateMessage(msgKey, interpolateParams).subscribe(
          (res) => this.pushInfoToast(res),
          (err) => this.pushInfoToast(msgKey)); // no translation found, push key
  }

  public pushErrorRaw(msg: string, error?: any) {
      this.logger.error(msg, error);
      this.pushInfoToast(msg);
  }

  public pushError(msgKey: string, interpolateParams?: any, error?: any) {

      this.translateMessage(msgKey, interpolateParams).subscribe(
          (res) => {
            this.logger.error(res, error);
            this.pushErrorToast(res);
          },
          (err) => this.pushErrorToast(msgKey)); // no translation found, push key
  }



  private pushInfoToast(msg: string) {
      this.subjet.next({
          message: msg,
          type: ToastType.Success
      });
  }

  private pushErrorToast(msg: string) {
      this.subjet.next({
          message: msg,
          type: ToastType.Error
      });
  }

  private translateMessage(msg: string, interpolateParams: any): Observable<string> {
      return this.translate.get(msg, interpolateParams);

  }

}
