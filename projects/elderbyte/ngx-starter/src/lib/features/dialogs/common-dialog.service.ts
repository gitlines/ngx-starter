import {ConfirmDialogComponent, ConfirmDialogConfig} from './confirm-dialog/confirm-dialog.component';
import {MatDialogRef, MatDialog, MatDialogConfig} from '@angular/material';
import { Injectable } from '@angular/core';
import {QuestionDialogComponent, QuestionDialogConfig} from './question-dialog/question-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {flatMap, filter} from 'rxjs/operators';


@Injectable()
export class CommonDialogService {

    constructor(
        private dialog: MatDialog,
        private translateService: TranslateService
    ) { }

    /**
     * @deprecated
     *
     * @param title
     * @param message
     * @param config
     */
    public confirm(title: string, message: string, config?: ConfirmDialogConfig): Observable<boolean> {

        let dialogRef: MatDialogRef<ConfirmDialogComponent>;

        dialogRef = this.dialog.open(ConfirmDialogComponent, config.config);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.yesNo = config.yesNo;

        return dialogRef.afterClosed();
    }


    /**
     * Creates a modal confirmation dialog.
     *
     * @param config object for conform dialog
     */
    public showConfirm(config: ConfirmDialogConfig): Observable<boolean> {

        if (!config) { throw new Error('Argument must not be null: config'); }

        const keys = [config.title, config.message];

        return this.translateService.get(keys, config.interpolateParams).pipe(
            flatMap(translated => {

                const title = translated[config.title];
                const message = translated[config.message];

                return this.confirm(title, message, config);

            })
            );

    }

    /**
     * @deprecated
     *
     * Creates a modal question dialog.
     *
     * @param title
     * @param question
     * @param config
     */
    public question(title: string, question: string, config?: MatDialogConfig): Observable<string> {

        const conf = config || new MatDialogConfig();
        conf.data = { title: title, question: question };

        const dialogRef = this.dialog.open(QuestionDialogComponent, conf);

        return dialogRef.afterClosed()
                .pipe(filter(response => !!response));
    }


    /**
     * Creates a modal question dialog.
     *
     * @param config
     */
    public showQuestion(config: QuestionDialogConfig): Observable<string> {

        if (!config) { throw new Error('Argument must not be null: config'); }

        const keys = [config.title, config.question];

        return this.translateService.get(keys, config.interpolateParams).pipe(
            flatMap(translated => {

                const title = translated[config.title];
                const message = translated[config.question];

                return this.question(title, message, config.config);

            }));

    }


}
