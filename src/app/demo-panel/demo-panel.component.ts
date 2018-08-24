import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IFileUploadClient} from '@elderbyte/ngx-starter';
import {FileUploadClient} from '../../../projects/elderbyte/ngx-starter/src/lib/common/data/rest/file-upload-client';
import {CommonDialogService} from '../../../projects/elderbyte/ngx-starter/src/lib/features/dialogs/common-dialog.service';

@Component({
  selector: 'starter-demo-demo-panel',
  templateUrl: './demo-panel.component.html',
  styleUrls: ['./demo-panel.component.scss']
})
export class DemoPanelComponent implements OnInit {

  public expanded: boolean;
  public uploadClient: IFileUploadClient;


  constructor(
    private http: HttpClient,
    private dialogService: CommonDialogService
  ) {
    this.uploadClient = new FileUploadClient(http, '/woot', 'POST');
  }

  ngOnInit() {
  }


  public openYesNo(event: any): void {
    this.dialogService.showConfirm({
        title: 'Simple yes or no question',
        message: "Are you ok?",
        yesNo: true,
        config: {
          autoFocus: false
        }
    }).subscribe()
  }

}
