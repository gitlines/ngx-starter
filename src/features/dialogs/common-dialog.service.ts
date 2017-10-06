import { Observable } from 'rxjs/Rx';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog.component';
import {MatDialogRef, MatDialog, MatDialogConfig, MdDialogConfig} from '@angular/material';
import { Injectable } from '@angular/core';
import {QuestionDialog} from './question-dialog/question-dialog.component';

@Injectable()
export class CommonDialogService {

    constructor(
        private dialog: MatDialog
    ) { }

    /**
     * Creates a modal confirmation dialog.
     * @param {string} title
     * @param {string} message
     * @param {MdDialogConfig} config
     * @returns {Observable<boolean>}
     */
    public confirm(title: string, message: string, config?: MdDialogConfig): Observable<boolean> {

        let dialogRef: MatDialogRef<ConfirmDialog>;

        dialogRef = this.dialog.open(ConfirmDialog, config);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed();
    }

    /**
     * Creates a modal question dialog.
     * @param {string} title
     * @param {string} question
     * @param {MdDialogConfig} config
     * @returns {Observable<string>}
     */
    public question(title: string, question: string, config?: MdDialogConfig): Observable<string> {

        const conf = config || new MdDialogConfig();
        conf.data = { title: title, question: question };

        let dialogRef = this.dialog.open(QuestionDialog, conf);

        return dialogRef.afterClosed()
                .filter(response => !response);
    }
}
