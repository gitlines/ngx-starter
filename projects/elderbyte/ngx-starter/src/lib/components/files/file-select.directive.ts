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

  @Input()
  public elderFileSelectMultiple = false;

  @Input()
  public elderFileSelect: string;

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

  public ngOnDestroy(): void {

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

    const input = this.renderer.createElement('input');
    this.renderer.setAttribute(input, 'hidden', 'true');
    this.renderer.setAttribute(input, 'type', 'file');
    this.renderer.appendChild(this.el.nativeElement, input);

    this._fileInput = input;

    this.renderer.listen(
      this._fileInput,
      'change',
        event => this.fileInputChanged(event)
    );
  }

  private fileInputChanged(event: any): void {
    const fileList = this._fileInput.files;

    const files = new Set<File>();

    for (const key in fileList) {
      if (!isNaN(parseInt(key, 0))) {
        files.add(fileList[key]);
      }
    }
    this.elderFileSelectChange.next(files);
  }

}
