import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ElderDialogConfig} from '../elder-dialog-config';

export class EbsQuestionDialogConfig extends ElderDialogConfig {

    /**
     * String appearing as question in the dialog.
     */
    public question: string;

}

@Component({
  selector: 'elder-question-dialog',
  templateUrl: './elder-question-dialog.component.html',
  styleUrls: ['./elder-question-dialog.component.scss']
})
export class ElderQuestionDialogComponent implements OnInit {

  public answer: string;

  constructor(
    public dialogRef: MatDialogRef<ElderQuestionDialogComponent>,
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
