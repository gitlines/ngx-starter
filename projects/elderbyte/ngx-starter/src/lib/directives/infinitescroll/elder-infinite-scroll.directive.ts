import {Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, Output} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {Observable, ReplaySubject, Subject, Subscription} from 'rxjs';
import {filter, throttleTime} from 'rxjs/operators';


@Directive({ selector: '[elderInfiniteScroll]' })
export class ElderInfiniteScrollDirective implements OnInit, OnDestroy {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderInfiniteScrollDirective');


  @Input()
  public eventThrottle = 150;

  @Input()
  public offsetFactor = 1;

  @Input()
  public ignoreScrollEvent = false;

  private scrollEventListenerOptions: AddEventListenerOptions;

  private readonly _zonedoutScrollEvents = new Subject<UIEvent>();
  private readonly _closeToEndSubject: ReplaySubject<UIEvent> = new ReplaySubject(1);

  private _zonedOutSub: Subscription;
  private _scrollContainer: HTMLElement;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private ngZone: NgZone,
    private hostRef: ElementRef) {

    this.register(hostRef.nativeElement);
  }

  /***************************************************************************
   *                                                                         *
   * Life-Cycle Hooks                                                        *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {

    this.scrollEventListenerOptions = { capture: true, passive: true };

    this._zonedOutSub = this._zonedoutScrollEvents.pipe(
      filter(ev => !!(ev.target as HTMLElement)),
      throttleTime(this.eventThrottle),               // Relax
      filter((ev: UIEvent) => this.isCloseToEnd(ev.target as HTMLElement))
    ).subscribe(
      event => {
        // The zoned out events are not tracked by angular change detection for performance.
        // After we have debounced and distilled out an interesting close-to-end event, we let angular know:
        this.ngZone.run(() => {
          this._closeToEndSubject.next(event);
        });
      }
    );
  }

  public ngOnDestroy(): void {
    this._zonedOutSub.unsubscribe();
    this.unregister();
  }



  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  @Output('closeToEnd')
  public get closeToEnd(): Observable<UIEvent> {
    return this._closeToEndSubject.asObservable();
  }

  @Input('containerId')
  public set containerId(containerId: string) {

    this.unregister();

    const scrollContainer = document.getElementById(containerId);
    this.register(scrollContainer);

    if (!scrollContainer) {
      this.logger.warn('Could not find scroll-container by id: ' + containerId);
    }
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private unregister(): void {
    if (this._scrollContainer) {
      window.removeEventListener('scroll', this.scroll, this.scrollEventListenerOptions);
    }
  }

  private register(scrollContainer: HTMLElement): void {

    this.unregister();
    this._scrollContainer = scrollContainer;

    if (this._scrollContainer) {

      this.logger.debug('Registered on scroll container: ', this._scrollContainer);

      this.ngZone.runOutsideAngular(() => {
        // Attach the scroll event listener outside of Angular change detection zone
        this._scrollContainer.addEventListener('scroll', this.scroll, this.scrollEventListenerOptions);
      });
    }
  }

  private isCloseToEnd(el: HTMLElement): boolean {
    if (el) {
      const range = el.offsetHeight * this.offsetFactor;
      const total = el.scrollHeight;
      const current = el.scrollTop + el.offsetHeight;
      return (total - current) < range;
    } else {
      return false;
    }
  }

  /**
   * Scroll event handler, invoked outside of angular zone.
   */
  private scroll = (ev: UIEvent): void => {
    if (this.ignoreScrollEvent) { return; }
    this._zonedoutScrollEvents.next(ev);
  }

}
