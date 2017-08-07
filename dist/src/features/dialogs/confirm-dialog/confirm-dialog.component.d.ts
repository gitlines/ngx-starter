import { MdDialogRef } from '@angular/material';
export declare class ConfirmDialog {
    dialogRef: MdDialogRef<ConfirmDialog>;
    title: string;
    message: string;
    constructor(dialogRef: MdDialogRef<ConfirmDialog>);
}
