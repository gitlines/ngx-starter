import {ConfirmDialogComponent, ConfirmDialogConfig} from './confirm-dialog/confirm-dialog.component';
import {MatDialogRef, MatDialog, MatDialogConfig} from '@angular/material';
import { Injectable } from '@angular/core';
import {QuestionDialogComponent, QuestionDialogConfig} from './question-dialog/question-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {flatMap, filter, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonDialogService {


  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/


  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService
  ) { }


  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * @deprecated Use showConfirm({...}) instead
   *
   * @param title
   * @param message
   * @param config
   */
  public confirm(title: string, message: string, config?: MatDialogConfig): Observable<boolean> {
    return this.showConfirm({
      title: title,
      message: message,
      config: config
    });
  }


  /**
   * Creates a modal confirmation dialog.
   *
   * @param config object for conform dialog
   */
  public showConfirm(config: ConfirmDialogConfig): Observable<boolean> {

    if (!config) { throw new Error('Argument must not be null: config'); }

    const keys = [config.title, config.message];

    return this.translateInterpolatedParams(config.interpolateParams).pipe(
      flatMap(
        interpolateParams => {
          return this.translateService.get(keys, interpolateParams).pipe(
            flatMap(translated => {

              const title = translated[config.title];
              const message = translated[config.message];

              // return this.confirm(title, message, config);

              let dialogRef: MatDialogRef<ConfirmDialogComponent>;

              dialogRef = this.dialog.open(ConfirmDialogComponent, config.config);
              dialogRef.componentInstance.title = title;
              dialogRef.componentInstance.message = message;
              dialogRef.componentInstance.yesNo = config.yesNo;

              return dialogRef.afterClosed();
            })
          );
        }
      )
    );
  }

  /**
   * @deprecated Use showQuestion({...}) instead
   *
   * Creates a modal question dialog.
   *
   * @param title
   * @param question
   * @param config
   */
  public question(title: string, question: string, config?: MatDialogConfig): Observable<string> {
    return this.showQuestion({
      title: title,
      question: question,
      config: config
    });
  }


  /**
   * Creates a modal question dialog.
   *
   * @param config
   */
  public showQuestion(config: QuestionDialogConfig): Observable<string> {

    if (!config) { throw new Error('Argument must not be null: config'); }

    const keys = [config.title, config.question];

    return this.translateInterpolatedParams(config.interpolateParams).pipe(
      flatMap(interpolateParams => {
        return this.translateService.get(keys, interpolateParams).pipe(
          flatMap(translated => {

            const title = translated[config.title];
            const message = translated[config.question];


            const dlgConf = config.config || new MatDialogConfig();
            dlgConf.data = { title: title, question: message };

            const dialogRef = this.dialog.open(QuestionDialogComponent, dlgConf);

            return dialogRef.afterClosed()
              .pipe(filter(response => !!response));

          }));
      })
    );
  }


  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  /**
   * Translates a list of params
   *
   * @param interpolateParams
   */
  private translateInterpolatedParams(interpolateParams: any): Observable<string | any> {

    const values = Object.getOwnPropertyNames(interpolateParams)
      .map(key => interpolateParams[key]);

    return this.translateService.get(values).pipe(
      map(translated => {

        Object.getOwnPropertyNames(interpolateParams)
          .forEach(key => {
            const value = interpolateParams[key];
            interpolateParams[key] = translated[value];
          });

        return interpolateParams;
      }));
  }
}
