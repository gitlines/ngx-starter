import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IFileUploadClient} from '../../../common/data/rest/file-upload-client';
import {forkJoin, Observable} from 'rxjs';

@Component({
  selector: 'ebs-file-select',
  templateUrl: './file-select.component.html',
  styleUrls: ['./file-select.component.scss']
})
export class FileSelectComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  public files: Set<File> = new Set();
  public uploadProgress: Map<File, Observable<number>>;
  public totalProgress: Observable<any>;

  @Input()
  public multiple = false;

  @Input()
  public accept: string = undefined;

  @Input()
  public uploadClient: IFileUploadClient;

  @Output()
  public readonly filesChange = new EventEmitter<Set<File>>();

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

  public selectFiles(event: any): void {
    this.openFileSelectDialog();
  }

  public fileInputChanged(): void {
    const fileList = this.fileInput.nativeElement.files;
    for (const key in fileList) {
      if (!isNaN(parseInt(key, 0))) {
        this.files.add(fileList[key]);
      }
    }
    this.filesChange.next(this.files);
  }

  public startUpload(): void {
    this.totalProgress = this.uploadAllFiles(this.files);
  }

  public progressOf(file: File): Observable<number> | undefined {
    if (this.uploadProgress) {
      return this.uploadProgress.get(file);
    } else {
      return undefined;
    }
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private openFileSelectDialog(): void {
    this.fileInput.nativeElement.click();
  }

  private uploadAllFiles(files: Set<File>): Observable<any> {
    this.uploadProgress = this.uploadClient.uploadFiles(files);
    return forkJoin(this.uploadProgress.values());
  }

}
