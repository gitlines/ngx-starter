import {MatDialogRef} from '@angular/material';
import { Component } from '@angular/core';
import {EbsCommonDialogConfig} from '../ebs-common-dialog-config';

export class ConfirmDialogConfig extends EbsCommonDialogConfig {

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
    selector: 'confirm-dialog',
    templateUrl: './ebs-confirm-dialog.component.html',
    styleUrls: ['./ebs-confirm-dialog.component.scss']
})
export class EbsConfirmDialogComponent {

    public title: string;
    public message: string;
    public yesNo = false;

    constructor(public dialogRef: MatDialogRef<EbsConfirmDialogComponent>) {

    }
}
