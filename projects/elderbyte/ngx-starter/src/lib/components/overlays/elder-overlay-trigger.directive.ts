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

  @Input('elderOverlayTriggerType')
  public type: 'click' | 'focus' = 'click';

  @Input('elderOverlayTriggerEnabled')
  public enabled = true;

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
    if (this.type === 'click') {
      this.handleTrigger();
    }
  }

  @HostListener('focus', ['$event'])
  handleFocus(event: MouseEvent): void {
    if (this.type === 'focus') {
      this.handleTrigger();
    }
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private handleTrigger(): void {
    if (this.enabled && this.overlay) {
      this.overlay.showOverlay({
        source: this._host
      });
    }
  }

}
