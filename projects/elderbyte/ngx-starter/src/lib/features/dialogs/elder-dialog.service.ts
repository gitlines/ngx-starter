import {ElderConfirmDialogComponent, ConfirmDialogConfig} from './confirm-dialog/elder-confirm-dialog.component';
import {MatDialogRef, MatDialog, MatDialogConfig} from '@angular/material';
import { Injectable } from '@angular/core';
import {ElderQuestionDialogComponent, EbsQuestionDialogConfig} from './question-dialog/elder-question-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';
import {flatMap, filter, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ElderDialogService {


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


    const rawMessages = new Map<string, string>();
    rawMessages.set('title', config.title);
    rawMessages.set('message', config.message);


    return this.resolveTranslatedMap(rawMessages, config.interpolateParams).pipe(
      flatMap(messages => {

        const title = messages.get('title');
        const message = messages.get('message');

        let dialogRef: MatDialogRef<ElderConfirmDialogComponent>;

        dialogRef = this.dialog.open(ElderConfirmDialogComponent, config.config);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.yesNo = config.yesNo;

        return dialogRef.afterClosed();

      })
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
  public showQuestion(config: EbsQuestionDialogConfig): Observable<string> {

    if (!config) { throw new Error('Argument must not be null: config'); }

    const rawMessages = new Map<string, string>();
    rawMessages.set('title', config.title);
    rawMessages.set('question', config.question);

    return this.resolveTranslatedMap(rawMessages, config.interpolateParams).pipe(
      flatMap(messages => {

        const title = messages.get('title');
        const question = messages.get('question');

        const dlgConf = config.config || new MatDialogConfig();
        dlgConf.data = {
          title: title,
          question: question
        };

        const dialogRef = this.dialog.open(ElderQuestionDialogComponent, dlgConf);

        return dialogRef.afterClosed()
          .pipe(filter(response => !!response));

      })
    );
  }


  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private resolveTranslatedMap(messages: Map<string, string>, interpolateParams?: object): Observable<Map<string, string>> {

    const rawMessages = Array.from(messages.values());

    return this.translateInterpolatedParams(interpolateParams).pipe(
      flatMap(translatedParams =>  this.translateService.get(rawMessages, translatedParams)),
      map(translatedValues => {
        const translated = new Map<string, string>();
        messages.forEach((rawValue, key) => {
          translated.set(key, translatedValues[rawValue] || rawValue);
        });
        return translated;
      }),
    );
  }

  /**
   * Translates a list of params
   *
   * @param interpolateParams
   */
  private translateInterpolatedParams(interpolateParams: any): Observable<string | any> {

    if (!interpolateParams) { return of({}); }

    const values = Object.getOwnPropertyNames(interpolateParams)
      .map(key => interpolateParams[key])
      .filter(value => !!value)
      .map(value => value + '');

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
