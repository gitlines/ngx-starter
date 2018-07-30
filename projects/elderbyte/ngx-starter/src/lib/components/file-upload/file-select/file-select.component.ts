import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

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

  @Input()
  public multiple = false;

  @Input()
  public accept: string = undefined;

  @Output()
  public readonly filesChange = new EventEmitter<Set<File>>();

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor() { }

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

  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private openFileSelectDialog(): void {
    this.fileInput.nativeElement.click();
  }

}
