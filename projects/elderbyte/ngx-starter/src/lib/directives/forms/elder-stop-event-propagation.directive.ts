import {Directive, HostListener} from '@angular/core';

/**
 * This directive suppresses event propagation on click events.
 * I.e. when you have large clickable areas which itself has smaller buttons on it:
 *
 * <a href="/go/home">
 *
 *  <button elderStopEventPropagation>X</button>
 * </a>
 *
 */
@Directive({
  selector: '[elderStopEventPropagation]'
})
export class ElderStopEventPropagationDirective {

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
  }
}
