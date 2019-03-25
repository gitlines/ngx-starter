import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Toast} from './toast';
import {ToastType} from './toast-type';
import {TranslateService} from '@ngx-translate/core';
import {LoggerFactory} from '@elderbyte/ts-logger';

export * from './toast';
export * from './toast-type';


@Injectable({
  providedIn: 'root'
})
export class ElderToastService {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderToastService');

  private subjet = new Subject<Toast>();

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private translate: TranslateService
  ) {}

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public getNotificationsObservable(): Observable<Toast> {
    return this.subjet.asObservable();
  }

  public pushNotification(msg: Toast) {
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

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

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

/**
 * @deprecated Please switch to ElderToastService
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService extends ElderToastService { }

/**
 * @deprecated Please switch to EbsToastService
 */
@Injectable({
  providedIn: 'root'
})
export class EbsToastService extends ElderToastService { }
