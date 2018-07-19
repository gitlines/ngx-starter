import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CommonDialogConfig} from '../common-dialog-config';

export class QuestionDialogConfig extends CommonDialogConfig {

    /**
     * String appearing as question in the dialog.
     */
    public question: string;

}

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.scss']
})
export class QuestionDialog implements OnInit {

  public answer: string;

  constructor(
    public dialogRef: MatDialogRef<QuestionDialog>,
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
