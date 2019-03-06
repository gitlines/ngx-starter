import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

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

  public fileInputChanged(files: Set<File>): void {
    this.filesChange.next(files);
  }

}
