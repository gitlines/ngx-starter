import {Directive, ElementRef, Input, OnDestroy, Output} from '@angular/core';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";


@Directive({ selector: '[infiniteScroll]' })
export class InfiniteScrollDirective implements OnDestroy{

  @Input('eventThrottle')
  public eventThrottle = 150;

  @Input('offsetFactor')
  public offsetFactor : number = 1;

  @Input('ignoreScrollEvent')
  public ignoreScrollEvent : boolean = false;

  public _scrollStream$: ReplaySubject<UIEvent> = new ReplaySubject(1);
  private scrollContainer : HTMLElement;

  constructor(el: ElementRef) {
  }

  @Output('closeToEnd')
  get closeToEnd() : Observable<UIEvent>{
    return this._scrollStream$
      .throttleTime(this.eventThrottle)
      .filter(ev => this.isCloseToEnd(ev.srcElement as HTMLElement))
      ;
  }


  @Input('containerId')
  set containerId(containerId : string) {
    let scrollContainer = document.getElementById(containerId);
    if(scrollContainer){
      console.log("Found scroll container: ", scrollContainer);
      this.setup(scrollContainer);
    }
  }

  ngOnDestroy(): void {
    if(this.scrollContainer){
      this.scrollContainer.onscroll = null as any;
    }
  }

  private setup(scrollContainer : HTMLElement) : void {

    console.log("Setting up scroll observable stream listener....");

    this.scrollContainer = scrollContainer;

    this.scrollContainer.onscroll = ev => {
      if(this.ignoreScrollEvent) return;
      this._scrollStream$.next(ev);
    };
  }

  private isCloseToEnd(el : HTMLElement) : boolean {
    const range = el.offsetHeight * this.offsetFactor;
    let total = el.scrollHeight;
    let current = el.scrollTop + el.offsetHeight;
    return (total-current) < range;
  }


}
