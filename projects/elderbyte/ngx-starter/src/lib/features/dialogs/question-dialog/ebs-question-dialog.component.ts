import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EbsCommonDialogConfig} from '../ebs-common-dialog-config';

export class EbsQuestionDialogConfig extends EbsCommonDialogConfig {

    /**
     * String appearing as question in the dialog.
     */
    public question: string;

}

@Component({
  selector: 'app-question-dialog',
  templateUrl: './ebs-question-dialog.component.html',
  styleUrls: ['./ebs-question-dialog.component.scss']
})
export class EbsQuestionDialogComponent implements OnInit {

  public answer: string;

  constructor(
    public dialogRef: MatDialogRef<EbsQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

  }

  public confirm(event: Event) {
    this.dialogRef.close(this.answer);
  }

  public cancel(event: Event): void {
    this.dialogRef.close();
  }

  public get isValid(): boolean {
    return !!this.answer;
  }

}
