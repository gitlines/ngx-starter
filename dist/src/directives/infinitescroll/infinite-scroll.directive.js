import { Directive, ElementRef, Input, Output } from '@angular/core';
import { ReplaySubject } from "rxjs/ReplaySubject";
var InfiniteScrollDirective = (function () {
    function InfiniteScrollDirective(el) {
        this.eventThrottle = 150;
        this.offsetFactor = 1;
        this.ignoreScrollEvent = false;
        this._scrollStream$ = new ReplaySubject(1);
    }
    Object.defineProperty(InfiniteScrollDirective.prototype, "closeToEnd", {
        get: function () {
            var _this = this;
            return this._scrollStream$
                .throttleTime(this.eventThrottle)
                .filter(function (ev) { return _this.isCloseToEnd(ev.srcElement); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InfiniteScrollDirective.prototype, "containerId", {
        set: function (containerId) {
            var scrollContainer = document.getElementById(containerId);
            if (scrollContainer) {
                console.log("Found scroll container: ", scrollContainer);
                this.setup(scrollContainer);
            }
        },
        enumerable: true,
        configurable: true
    });
    InfiniteScrollDirective.prototype.ngOnDestroy = function () {
        if (this.scrollContainer) {
            this.scrollContainer.onscroll = null;
        }
    };
    InfiniteScrollDirective.prototype.setup = function (scrollContainer) {
        var _this = this;
        console.log("Setting up scroll observable stream listener....");
        this.scrollContainer = scrollContainer;
        this.scrollContainer.onscroll = function (ev) {
            if (_this.ignoreScrollEvent)
                return;
            _this._scrollStream$.next(ev);
        };
    };
    InfiniteScrollDirective.prototype.isCloseToEnd = function (el) {
        var range = el.offsetHeight * this.offsetFactor;
        var total = el.scrollHeight;
        var current = el.scrollTop + el.offsetHeight;
        return (total - current) < range;
    };
    InfiniteScrollDirective.decorators = [
        { type: Directive, args: [{ selector: '[infiniteScroll]' },] },
    ];
    /** @nocollapse */
    InfiniteScrollDirective.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    InfiniteScrollDirective.propDecorators = {
        'eventThrottle': [{ type: Input, args: ['eventThrottle',] },],
        'offsetFactor': [{ type: Input, args: ['offsetFactor',] },],
        'ignoreScrollEvent': [{ type: Input, args: ['ignoreScrollEvent',] },],
        'closeToEnd': [{ type: Output, args: ['closeToEnd',] },],
        'containerId': [{ type: Input, args: ['containerId',] },],
    };
    return InfiniteScrollDirective;
}());
export { InfiniteScrollDirective };
//# sourceMappingURL=infinite-scroll.directive.js.map