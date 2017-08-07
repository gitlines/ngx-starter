import { PipeTransform, NgZone, ChangeDetectorRef, OnDestroy } from "@angular/core";
/**
 * Source code from
 * https://github.com/AndrewPoyntz/time-ago-pipe
 */
export declare class TimeAgoPipe implements PipeTransform, OnDestroy {
    private changeDetectorRef;
    private ngZone;
    private timer;
    constructor(changeDetectorRef: ChangeDetectorRef, ngZone: NgZone);
    transform(value: string): string;
    ngOnDestroy(): void;
    private removeTimer();
    private getSecondsUntilUpdate(seconds);
}
