import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[elderDelayedFocus]'
})
export class ElderDelayedFocusDirective implements AfterViewInit {

  @Input()
  public elderDelayedFocus: number;


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
    }, this.elderDelayedFocus || 500);
  }

  /***************************************************************************
   *                                                                         *
   * Private Methods                                                         *
   *                                                                         *
   **************************************************************************/


  private focusFirstInput(): void {
    if (this.el) {
      console.log('ElderDelayedFocusDirective - focusing element ...');
      this.el.nativeElement.focus();
    } else {
      console.warn('ElderDelayedFocusDirective - No element found to focus!');
    }
  }
}
