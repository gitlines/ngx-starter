import {Directive, ElementRef, Input, OnDestroy, Output} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {Observable, ReplaySubject} from 'rxjs/index';
import {filter, throttleTime} from 'rxjs/operators';


@Directive({ selector: '[infiniteScroll]' })
export class InfiniteScrollDirective implements OnDestroy {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger = LoggerFactory.getLogger('InfiniteScrollDirective');


    @Input('eventThrottle')
    public eventThrottle = 150;

    @Input('offsetFactor')
    public offsetFactor = 1;

    @Input('ignoreScrollEvent')
    public ignoreScrollEvent = false;

    private readonly _scrollStream$: ReplaySubject<UIEvent> = new ReplaySubject(1);
    private _scrollContainer: HTMLElement;

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        el: ElementRef) {
    }

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/

    @Output('closeToEnd')
    public get closeToEnd(): Observable<UIEvent> {
        return this._scrollStream$.pipe(
            filter(ev => !!(ev.target as HTMLElement)),
            throttleTime(this.eventThrottle),               // Relax
            filter((ev: UIEvent) => this.isCloseToEnd(ev.target as HTMLElement))
            );
    }

    @Input('containerId')
    public set containerId(containerId: string) {

        this.unregister();

        const scrollContainer = document.getElementById(containerId);
        if (scrollContainer) {
            this.logger.debug('Found scroll container: ', scrollContainer);
            this.setup(scrollContainer);
        } else {
            this.logger.warn('Could not find scroll-container by id: ' + containerId);
        }
    }

    /***************************************************************************
     *                                                                         *
     * Life-Cycle Hooks                                                        *
     *                                                                         *
     **************************************************************************/

    public ngOnDestroy(): void {
        this.unregister();
    }

    /***************************************************************************
     *                                                                         *
     * Private methods                                                         *
     *                                                                         *
     **************************************************************************/

    private unregister(): void {
        if (this._scrollContainer) {
            this._scrollContainer.onscroll = null as any;
        }
    }

    private setup(scrollContainer: HTMLElement): void {

        this.logger.info('Setting up scroll observable stream listener on', scrollContainer);

        this._scrollContainer = scrollContainer;

        this._scrollContainer.onscroll = ev => {
            if (this.ignoreScrollEvent) { return; }
            this._scrollStream$.next(ev);
        };
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


}
