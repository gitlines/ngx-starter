import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'ebs-file-select',
  templateUrl: './file-select.component.html',
  styleUrls: ['./file-select.component.scss']
})
export class EbsFileSelectComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  @Input()
  public multiple = false;

  @Input()
  public accept: string = undefined;

  @Input()
  public icon = 'add';

  @Input()
  public color: string;

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

    const files = new Set<File>();

    for (const key in fileList) {
      if (!isNaN(parseInt(key, 0))) {
        files.add(fileList[key]);
      }
    }
    this.filesChange.next(files);
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
