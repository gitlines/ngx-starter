import { Pipe, NgZone, ChangeDetectorRef } from "@angular/core";
/**
 * Source code from
 * https://github.com/AndrewPoyntz/time-ago-pipe
 */
var TimeAgoPipe = (function () {
    function TimeAgoPipe(changeDetectorRef, ngZone) {
        this.changeDetectorRef = changeDetectorRef;
        this.ngZone = ngZone;
    }
    TimeAgoPipe.prototype.transform = function (value) {
        var _this = this;
        this.removeTimer();
        if (!value)
            return 'unknown time';
        var d = new Date(value);
        var now = new Date();
        var seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
        var timeToUpdate = this.getSecondsUntilUpdate(seconds) * 1000;
        this.timer = this.ngZone.runOutsideAngular(function () {
            if (typeof window !== 'undefined') {
                return window.setTimeout(function () {
                    _this.ngZone.run(function () { return _this.changeDetectorRef.markForCheck(); });
                }, timeToUpdate);
            }
            return null;
        });
        var minutes = Math.round(Math.abs(seconds / 60));
        var hours = Math.round(Math.abs(minutes / 60));
        var days = Math.round(Math.abs(hours / 24));
        var months = Math.round(Math.abs(days / 30.416));
        var years = Math.round(Math.abs(days / 365));
        if (seconds <= 45) {
            return 'a few seconds ago';
        }
        else if (seconds <= 90) {
            return 'a minute ago';
        }
        else if (minutes <= 45) {
            return minutes + ' minutes ago';
        }
        else if (minutes <= 90) {
            return 'an hour ago';
        }
        else if (hours <= 22) {
            return hours + ' hours ago';
        }
        else if (hours <= 36) {
            return 'a day ago';
        }
        else if (days <= 25) {
            return days + ' days ago';
        }
        else if (days <= 45) {
            return 'a month ago';
        }
        else if (days <= 345) {
            return months + ' months ago';
        }
        else if (days <= 545) {
            return 'a year ago';
        }
        else {
            return years + ' years ago';
        }
    };
    TimeAgoPipe.prototype.ngOnDestroy = function () {
        this.removeTimer();
    };
    TimeAgoPipe.prototype.removeTimer = function () {
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    };
    TimeAgoPipe.prototype.getSecondsUntilUpdate = function (seconds) {
        var min = 60;
        var hr = min * 60;
        var day = hr * 24;
        if (seconds < min) {
            return 2;
        }
        else if (seconds < hr) {
            return 30;
        }
        else if (seconds < day) {
            return 300;
        }
        else {
            return 3600;
        }
    };
    TimeAgoPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'timeAgo',
                    pure: false
                },] },
    ];
    /** @nocollapse */
    TimeAgoPipe.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
        { type: NgZone, },
    ]; };
    return TimeAgoPipe;
}());
export { TimeAgoPipe };
//# sourceMappingURL=time-ago.pipe.js.map