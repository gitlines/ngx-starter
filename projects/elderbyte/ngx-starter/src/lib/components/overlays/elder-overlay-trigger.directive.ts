import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {ElderOverlayComponent} from './elder-overlay.component';

@Directive({
  selector: '[elderOverlayTrigger]'
})
export class ElderOverlayTriggerDirective {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderOverlayTriggerDirective');

  private _overlay: ElderOverlayComponent;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private _host: ElementRef<HTMLElement>,
  ) { }

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent): void {
    if (this.overlay) {
      this.overlay.showOverlay();
    }
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  @Input('elderOverlayTrigger')
  public set overlay(overlay: ElderOverlayComponent) {
    this._overlay = overlay;
    // TODO Register some
    this._overlay.elderOverlayOrigin = this._host;
  }

  public get overlay(): ElderOverlayComponent {
    return this._overlay;
  }
}
