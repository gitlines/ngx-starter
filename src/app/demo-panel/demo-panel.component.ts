import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IFileUploadClient} from '@elderbyte/ngx-starter';
import {FileUploadClient} from '../../../projects/elderbyte/ngx-starter/src/lib/common/data/rest/file-upload-client';

@Component({
  selector: 'starter-demo-demo-panel',
  templateUrl: './demo-panel.component.html',
  styleUrls: ['./demo-panel.component.scss']
})
export class DemoPanelComponent implements OnInit {

  public expanded: boolean;
  public uploadClient: IFileUploadClient;


  constructor(
    private http: HttpClient
  ) {
    this.uploadClient = new FileUploadClient(http, '/woot', 'POST');
  }

  ngOnInit() {
  }

}
