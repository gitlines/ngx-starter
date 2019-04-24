import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Toast} from './toast';
import {ToastType} from './toast-type';
import {TranslateService} from '@ngx-translate/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {catchError} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {HttpErrorResponse} from '@angular/common/http';

export * from './toast';
export * from './toast-type';


export interface ToastOptions {
  interpolateParams?: Object;
}

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

  public info(msg: string, options?: ToastOptions): void {
    this.translateMessage(msg, options).subscribe(
      (translated) => this.pushToast(translated, ToastType.Success)
    );
  }

  public warn(msg: string, options?: ToastOptions): void {
    this.translateMessage(msg, options).subscribe(
      (translated) => this.pushToast(translated, ToastType.Warning)
    );
  }

  public error(msg: string, error: any, options?: ToastOptions): void {

    const errDetail = this.errorToMessage(error);

    this.logger.error(msg, error);

    this.translateMessage(msg, options).subscribe(
      (translated) => {

        let message = translated;

        if (errDetail) {
          message += ' ' + errDetail;
        }

        this.pushToast(message, ToastType.Error);
      }
    );
  }

  /***************************************************************************
   *                                                                         *
   * Public API (Old)                                                        *
   *                                                                         *
   **************************************************************************/

  /**
   * @deprecated Use info()
   */
  public pushInfoRaw(msg: string): void {
    this.info(msg);
  }

  /**
   * @deprecated Use info()
   */
  public pushInfo(msgKey: string, interpolateParams?: Object) {
    this.info(msgKey, interpolateParams);
  }

  /**
   * @deprecated Use error()
   */
  public pushErrorRaw(msg: string, error?: any) {
    this.error(msg, error);
  }

  /**
   * @deprecated Use error()
   */
  public pushError(msgKey: string, interpolateParams?: any, error?: any) {
    this.error(msgKey, error, interpolateParams);
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private errorToMessage(error: any): string | null {
    if (error instanceof HttpErrorResponse) {
      if (error.error && error.error.message) {
        return error.error.message;
      }
    } else if (error instanceof Error) {
      if (error.message) {
        return error.message;
      }
    }
    return null;
  }

  private pushToast(msg: string, type: ToastType) {
    this.toast({
      message: msg,
      type: type
    });
  }

  private toast(toast: Toast): void {
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

  private translateMessage(msg: string, options?: ToastOptions): Observable<string> {
    return this.translate.get(msg, options ? options.interpolateParams : null).pipe(
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
