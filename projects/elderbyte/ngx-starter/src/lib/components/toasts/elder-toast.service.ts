import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Toast} from './toast';
import {ToastType} from './toast-type';
import {TranslateService} from '@ngx-translate/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {catchError} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';

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
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) {}

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get notifications(): Observable<Toast> {
    return this.subjet.asObservable();
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public pushNotification(msg: Toast) {
    this.subjet.next(msg);
  }

  public pushInfoRaw(msg: string) {
    this.pushToast(msg, ToastType.Success);
  }

  public pushInfo(msgKey: string, interpolateParams?: Object) {
    this.translateMessage(msgKey, interpolateParams).subscribe(
      (translated) => this.pushToast(translated, ToastType.Success)
    );
  }

  public pushErrorRaw(msg: string, error?: any) {
    this.logger.error(msg, error);
    this.pushToast(msg, ToastType.Error);
  }

  public pushError(msgKey: string, interpolateParams?: any, error?: any) {
    this.translateMessage(msgKey, interpolateParams).subscribe(
      (translated) => this.pushErrorRaw(translated, error)
      );
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private pushToast(msg: string, type: ToastType) {
    const toast: Toast = {
      message: msg,
      type: type
    };
    this.subjet.next(toast);
    this.showToast(toast);
  }

  private showToast(toast: Toast): void {
    this.snackBar.open(
      toast.message,
      'OK', {
        duration: 3000,
        panelClass: this.toastClass(toast.type)
      }
      );
  }

  private toastClass(type: ToastType): string {
    switch (type) {
      case ToastType.Success: return 'elder-success-toast';
      case ToastType.Warning: return 'elder-warning-toast';
      case ToastType.Error: return 'elder-error-toast';
    }
  }

  private translateMessage(msg: string, interpolateParams: any): Observable<string> {
    return this.translate.get(msg, interpolateParams).pipe(
      catchError(err => msg) // // no translation found, we use the translation key
    );
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
