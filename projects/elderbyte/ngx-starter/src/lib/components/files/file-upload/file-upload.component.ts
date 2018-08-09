import {Component, Input, OnInit} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {FileUpload, IFileUploadClient} from '../../../common/data/rest/file-upload-client';

@Component({
  selector: 'ebs-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class EbsFileUploadComponent implements OnInit {


  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  @Input()
  public files: Set<File> = new Set();
  public uploadProgress: Map<File, FileUpload>;
  public totalProgress: Observable<any>;

  @Input()
  public multiple = false;

  @Input()
  public accept: string = undefined;

  @Input()
  public uploadClient: IFileUploadClient;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor() {
  }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {

  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public startUpload(event: any): void {
    this.totalProgress = this.uploadAllFiles(this.files);
  }

  public statusOf(file: File): FileUpload {
    if (this.uploadProgress) {
      return this.uploadProgress.get(file);
    }
    return undefined;
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private uploadAllFiles(files: Set<File>): Observable<any> {
    this.uploadProgress = this.uploadClient.uploadFiles(files);
    return forkJoin(this.uploadProgress.values());
  }

}
