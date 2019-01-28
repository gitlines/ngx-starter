import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[delayedFocus]'
})
export class EbsDelayedFocusDirective implements AfterViewInit {

  @Input()
  public delayedFocus: number;


  constructor(private el: ElementRef) {

  }

  /***************************************************************************
   *                                                                         *
   * Life cycle hooks                                                        *
   *                                                                         *
   **************************************************************************/


  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.focusFirstInput();
    }, this.delayedFocus || 500);
  }

  /***************************************************************************
   *                                                                         *
   * Private Methods                                                         *
   *                                                                         *
   **************************************************************************/


  private focusFirstInput(): void {
    if (this.el) {
      console.log('EbsDelayedFocusDirective - focusing element ...');
      this.el.nativeElement.focus();
    } else {
      console.warn('EbsDelayedFocusDirective - No element found to focus!');
    }
  }
}
