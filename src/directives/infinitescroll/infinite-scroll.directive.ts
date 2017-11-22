import {Directive, ElementRef, Input, OnDestroy, Output} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/filter';
import {NGXLogger} from 'ngx-logger';


@Directive({ selector: '[infiniteScroll]' })
export class InfiniteScrollDirective implements OnDestroy {

    @Input('eventThrottle')
    public eventThrottle = 150;

    @Input('offsetFactor')
    public offsetFactor = 1;

    @Input('ignoreScrollEvent')
    public ignoreScrollEvent = false;

    public _scrollStream$: ReplaySubject<UIEvent> = new ReplaySubject(1);
    private scrollContainer: HTMLElement;

    constructor(
        private logger: NGXLogger,
        el: ElementRef) {
    }

    @Output('closeToEnd')
    get closeToEnd(): Observable<UIEvent>{
        return this._scrollStream$
            .filter(ev => !!(ev.srcElement as HTMLElement)) // Ignore events which do not originate from an HTMLElement
            .throttleTime(this.eventThrottle)               // Relax
            .filter(ev => this.isCloseToEnd(ev.srcElement as HTMLElement))
            ;
    }


    @Input('containerId')
    set containerId(containerId: string) {
        let scrollContainer = document.getElementById(containerId);
        if (scrollContainer) {
            this.logger.debug('Found scroll container: ', scrollContainer);
            this.setup(scrollContainer);
        }
    }

    ngOnDestroy(): void {
        if (this.scrollContainer) {
            this.scrollContainer.onscroll = null as any;
        }
    }

    private setup(scrollContainer: HTMLElement): void {

        this.logger.info('Setting up scroll observable stream listener....');

        this.scrollContainer = scrollContainer;

        this.scrollContainer.onscroll = ev => {
            if (this.ignoreScrollEvent) { return; }
            this._scrollStream$.next(ev);
        };
    }

    private isCloseToEnd(el: HTMLElement): boolean {
        if (el) {
            const range = el.offsetHeight * this.offsetFactor;
            let total = el.scrollHeight;
            let current = el.scrollTop + el.offsetHeight;
            return (total - current) < range;
        } else {
            return false;
        }
    }


}
