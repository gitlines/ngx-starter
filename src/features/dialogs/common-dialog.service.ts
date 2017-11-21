import { Observable } from 'rxjs/Rx';
import {ConfirmDialog, ConfirmDialogConfig} from './confirm-dialog/confirm-dialog.component';
import {MatDialogRef, MatDialog, MatDialogConfig} from '@angular/material';
import { Injectable } from '@angular/core';
import {QuestionDialog, QuestionDialogConfig} from './question-dialog/question-dialog.component';
import {TranslateService} from '@ngx-translate/core';


@Injectable()
export class CommonDialogService {

    constructor(
        private dialog: MatDialog,
        private translateService: TranslateService
    ) { }

    /**
     * @deprecated
     *
     * Creates a modal confirmation dialog.
     *
     * @param {string} title
     * @param {string} message
     * @param {MdDialogConfig} config
     * @returns {Observable<boolean>}
     */
    public confirm(title: string, message: string, config?: MatDialogConfig): Observable<boolean> {

        let dialogRef: MatDialogRef<ConfirmDialog>;

        dialogRef = this.dialog.open(ConfirmDialog, config);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed();
    }


    /**
     * Creates a modal confirmation dialog.
     *
     * @param {ConfirmDialogConfig} config object for conform dialog
     * @returns {Observable<boolean>}
     */
    public showConfirm(config: ConfirmDialogConfig): Observable<boolean> {

        if (!config) { throw new Error('Argument must not be null: config') }

        const keys = [config.title, config.message];

        return this.translateService.get(keys, config.interpolateParams)
            .flatMap(translated => {

                const title = translated[config.title];
                const message = translated[config.message];

                return this.confirm(title, message, config.config);

            });

    }

    /**
     * @deprecated
     *
     * Creates a modal question dialog.
     *
     * @param {string} title
     * @param {string} question
     * @param {MdDialogConfig} config
     * @returns {Observable<string>}
     */
    public question(title: string, question: string, config?: MatDialogConfig): Observable<string> {

        const conf = config || new MatDialogConfig();
        conf.data = { title: title, question: question };

        let dialogRef = this.dialog.open(QuestionDialog, conf);

        return dialogRef.afterClosed()
                .filter(response => !!response);
    }


    /**
     * Creates a modal question dialog.
     *
     * @param {QuestionDialogConfig} config
     * @returns {Observable<string>}
     */
    public showQuestion(config: QuestionDialogConfig): Observable<string> {

        if (!config) { throw new Error('Argument must not be null: config') }

        const keys = [config.title, config.question];

        return this.translateService.get(keys, config.interpolateParams)
            .flatMap(translated => {

                const title = translated[config.title];
                const message = translated[config.question];

                return this.question(title, message, config.config);

            });

    }


}
