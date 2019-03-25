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

  @Input('elderOverlayTrigger')
  public overlay: ElderOverlayComponent;

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
   * Event Listeners                                                         *
   *                                                                         *
   **************************************************************************/

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent): void {
    if (this.overlay) {
      this.overlay.showOverlay({
        source: this._host
      });
    }
  }

}
