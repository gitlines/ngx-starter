import {MatDialogRef} from '@angular/material';
import { Component } from '@angular/core';
import {ElderDialogConfig} from '../elder-dialog-config';

export class ConfirmDialogConfig extends ElderDialogConfig {

    /**
     * String appearing as message in the dialog.
     */
    public message: string;

    /**
     * If true, dialog will show 'yes' and 'no' instead of 'ok' and 'cancel' as options.
     */
    public yesNo?: boolean;

}

@Component({
    selector: 'elder-confirm-dialog',
    templateUrl: './elder-confirm-dialog.component.html',
    styleUrls: ['./elder-confirm-dialog.component.scss']
})
export class ElderConfirmDialogComponent {

    public title: string;
    public message: string;
    public yesNo = false;

    constructor(public dialogRef: MatDialogRef<ElderConfirmDialogComponent>) {

    }
}
