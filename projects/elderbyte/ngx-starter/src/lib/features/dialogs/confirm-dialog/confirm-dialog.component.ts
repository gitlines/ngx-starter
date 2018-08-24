import {MatDialogConfig, MatDialogRef} from '@angular/material';
import { Component } from '@angular/core';
import {CommonDialogConfig} from '../common-dialog-config';

export class ConfirmDialogConfig extends CommonDialogConfig {

    /**
     * String appearing as message in the dialog.
     */
    public message: string;

    /**
     * If true, dialog will show 'yes' and 'no' instead of 'ok' and 'cancel' as options.
     */
    public yesNo? = false;

}

@Component({
    selector: 'confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

    public title: string;
    public message: string;
    public yesNo: boolean = false;

    constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {

    }
}
