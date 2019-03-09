import {Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';

@Directive({
  selector: '[elderFileSelect]'
})
export class FileSelectDirective implements OnInit, OnDestroy {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('FileSelectDirective');

  private _fileInput: HTMLInputElement;

  @Output()
  public readonly elderFileSelectChange = new EventEmitter<Set<File>>();

  private _multiple: boolean;
  private _accept: string;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {
    this.createFileSelect();
  }

  public ngOnDestroy(): void { }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  @Input()
  public set elderFileSelect(value: string) {
    this._accept = value;
    if (this._fileInput) {
      this.renderer.setProperty(this._fileInput, 'accept', value);
    }
  }

  @Input()
  public set elderFileSelectMultiple(value: boolean) {
    this._multiple = value;
    if (this._fileInput) {
      this.renderer.setProperty(this._fileInput, 'multiple', value);
    }
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    this.openFileSelectDialog();
  }

  public openFileSelectDialog(): void {
    this._fileInput.click();
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  /**
   * <input type="file"
   *     hidden #fileInput
   *     [multiple]="multiple"
   *     [accept]="accept"
   *     (change)="fileInputChanged()"
   * />
   */
  private createFileSelect(): void {

    this._fileInput = this.renderer.createElement('input');
    this.renderer.setAttribute(this._fileInput, 'hidden', 'true');
    this.renderer.setAttribute(this._fileInput, 'type', 'file');
    this.renderer.appendChild(this.el.nativeElement, this._fileInput);

    if (this._accept) {
      this.renderer.setProperty(this._fileInput, 'accept', this._accept);
    }
    if (this._multiple) {
      this.renderer.setProperty(this._fileInput, 'multiple', this._multiple);
    }

    this.renderer.listen(
      this._fileInput,
      'change',
        event => this.fileInputChanged(event)
    );
  }

  private fileInputChanged(event: any): void {
    const fileList = this._fileInput.files;
    this.emitFileList(fileList);
  }

  private emitFileList(fileList: FileList): void {
    if (fileList.length > 0) {
      this.elderFileSelectChange.next(
        this.toSet(fileList)
      );
    }
  }

  private toSet(fileList: FileList): Set<File> {
    const files = new Set<File>();

    for (const key in fileList) {
      if (!isNaN(parseInt(key, 0))) {
        files.add(fileList[key]);
      }
    }
    return files;
  }

}
