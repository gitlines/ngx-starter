import {Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';

@Directive({
  selector: '[elderFileDropZone]'
})
export class FileDropZoneDirective implements OnInit, OnDestroy {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('FileDropZoneDirective');

  @Output()
  public readonly elderFileDropZoneChange = new EventEmitter<Set<File>>();

  @Input()
  public dragOverClass = 'is-dragover';

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private hostRef: ElementRef,
    private renderer: Renderer2
  ) { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void { }

  public ngOnDestroy(): void { }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  @HostListener('dragover', ['$event'])
  public onDragOver(evt: DragEvent): void {
    evt.preventDefault(); // Prevent default browser action
    this.renderer.addClass(this.hostRef.nativeElement, this.dragOverClass);
  }

  @HostListener('dragend', ['$event'])
  @HostListener('dragleave', ['$event'])
  public onDragEnd(evt: DragEvent): void {
    evt.preventDefault(); // Prevent default browser action
    this.dragEnd(evt);
  }

  @HostListener('drop', ['$event'])
  public onDrop(evt: DragEvent): void {

    this.logger.debug('drop event!', evt);

    evt.preventDefault();
    evt.stopPropagation();
    this.dragEnd(evt);

    const files = this.collectFiles(evt);

    this.logger.debug('User dropped ' + files.size + 'files!', files);

    this.emitFiles(files);
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private dragEnd(evt: DragEvent): void {
    this.renderer.removeClass(this.hostRef.nativeElement, this.dragOverClass);
  }

  private collectFiles(ev: DragEvent): Set<File> {
    const files = new Set<File>();
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') { // ignore kind 'string'
          const file = ev.dataTransfer.items[i].getAsFile();
          files.add(file);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.files.length; i++) {
        files.add(ev.dataTransfer.files[i]);
      }
    }
    return files;
  }

  private emitFiles(files: Set<File>): void {
    if (files.size > 0) {
      this.elderFileDropZoneChange.next(
        files
      );
    }
  }
}
