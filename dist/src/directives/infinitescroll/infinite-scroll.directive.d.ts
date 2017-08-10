import { ElementRef, OnDestroy } from '@angular/core';
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Observable } from "rxjs/Observable";
export declare class InfiniteScrollDirective implements OnDestroy {
    eventThrottle: number;
    offsetFactor: number;
    ignoreScrollEvent: boolean;
    _scrollStream$: ReplaySubject<UIEvent>;
    private scrollContainer;
    constructor(el: ElementRef);
    readonly closeToEnd: Observable<UIEvent>;
    containerId: string;
    ngOnDestroy(): void;
    private setup(scrollContainer);
    private isCloseToEnd(el);
}
