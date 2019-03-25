import {Directive, ElementRef, Input} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {ElderOverlayComponent} from './elder-overlay.component';

@Directive({
  selector: '[elderOverlayOrigin]'
})
export class ElderOverlayOriginDirective {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderOverlayOriginDirective');

  private _overlay: ElderOverlayComponent;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private _host: ElementRef<HTMLElement>,
  ) { }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  @Input('elderOverlayOrigin')
  public set overlay(overlay: ElderOverlayComponent) {
    this._overlay = overlay;
    this._overlay.origin = this._host;
  }

  public get overlay(): ElderOverlayComponent {
    return this._overlay;
  }
}
