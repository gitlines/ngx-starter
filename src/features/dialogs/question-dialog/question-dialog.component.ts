import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.scss']
})
export class QuestionDialog implements OnInit {

  public answer: string;

  constructor(
    public dialogRef: MdDialogRef<QuestionDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {

  }

  confirm(event: Event) {
    this.dialogRef.close(this.answer);
  }

  cancel(event: Event): void {
    this.dialogRef.close();
  }

  public get isValid(): boolean {
    return !!this.answer;
  }

}
