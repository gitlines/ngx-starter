(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/router'), require('@angular/common'), require('@angular/material'), require('@angular/flex-layout')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/router', '@angular/common', '@angular/material', '@angular/flex-layout'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.ngxStarter = global.ng.ngxStarter || {}),global.ng.core,global.ng.router,global._angular_common,global._angular_material,global._angular_flexLayout));
}(this, (function (exports,_angular_core,_angular_router,_angular_common,_angular_material,_angular_flexLayout) { 'use strict';

var BreadcrumbContext = (function () {
    function BreadcrumbContext() {
        this.exactPathReplacers = new Map();
        this.exactPathHandlers = new Map();
        this.dynamicHandlers = [];
        this.replaceExactPath('/app', null);
    }
    BreadcrumbContext.prototype.replaceExactPath = function (exactPath, label) {
        this.exactPathReplacers.set(exactPath, label);
    };
    BreadcrumbContext.prototype.handleExactPath = function (exactPath, handler) {
        this.exactPathHandlers.set(exactPath, handler);
    };
    BreadcrumbContext.prototype.addDynamicHandler = function (handler) {
        this.dynamicHandlers.push(handler);
    };
    BreadcrumbContext.prototype.buildCrumb = function (url) {
        if (this.exactPathReplacers.has(url)) {
            var replacement = this.exactPathReplacers.get(url);
            if (replacement) {
                return this.build(url, replacement);
            }
            else {
                return null;
            }
        }
        var handler = this.exactPathHandlers.get(url);
        if (handler) {
            return handler(url);
        }
        for (var _i = 0, _a = this.dynamicHandlers; _i < _a.length; _i++) {
            var dh = _a[_i];
            var dynamicReplacement = dh(url);
            if (dynamicReplacement) {
                return dynamicReplacement;
            }
        }
        return this.buildCrumbFallback(url);
    };
    BreadcrumbContext.prototype.buildCrumbFallback = function (url) {
        var parts = url.split('/');
        var last = parts[parts.length - 1];
        last = last.split('(')[0];
        return this.build(url, last);
    };
    BreadcrumbContext.prototype.build = function (url, label) {
        return new Breadcrumb(label, url);
    };
    return BreadcrumbContext;
}());
var Breadcrumb = (function () {
    function Breadcrumb(label, url) {
        this.label = label;
        this.url = url;
    }
    return Breadcrumb;
}());
var BreadcrumbService = (function () {
    function BreadcrumbService() {
        this.context = new BreadcrumbContext();
    }
    BreadcrumbService.prototype.generateBreadcrumbs = function (url) {
        var crumbs = [];
        var beforeSubOutletsUrl = url.split('(')[0];
        this.generateBreadcrumbsRecursive(beforeSubOutletsUrl, crumbs);
        return crumbs;
    };
    BreadcrumbService.prototype.generateBreadcrumbsRecursive = function (url, crumbs) {
        var crumb = this.buildCrumb(url);
        if (crumb) {
            crumbs.unshift(crumb);
        }
        if (url.lastIndexOf('/') > 0) {
            this.generateBreadcrumbsRecursive(url.substr(0, url.lastIndexOf('/')), crumbs); //Find last '/' and add everything before it as a parent route
        }
        else if (this.context && this.context.prefix) {
            crumbs.unshift(this.context.prefix);
        }
    };
    BreadcrumbService.prototype.buildCrumb = function (url) {
        return this.context.buildCrumb(url);
    };
    BreadcrumbService.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    BreadcrumbService.ctorParameters = function () { return []; };
    return BreadcrumbService;
}());

var BreadcrumbComponent = (function () {
    /**
     * @class DetailComponent
     * @constructor
     */
    function BreadcrumbComponent(breadcrumbService, router, route) {
        this.breadcrumbService = breadcrumbService;
        this.router = router;
        this.route = route;
        this.ROUTE_DATA_BREADCRUMB = "breadcrumb";
        this.breadcrumbs = [];
    }
    /**
     * Let's go!
     *
     * @class DetailComponent
     * @method ngOnInit
     */
    BreadcrumbComponent.prototype.ngOnInit = function () {
        var _this = this;
        //subscribe to the NavigationEnd event
        this.router.events
            .filter(function (event) { return event instanceof _angular_router.NavigationEnd; })
            .map(function (event) { return event; })
            .subscribe(function (event) {
            var url = event.urlAfterRedirects ? event.urlAfterRedirects : event.url;
            _this.updateBreadcrumbs(url);
        });
        this.updateBreadcrumbs(location.pathname);
    };
    BreadcrumbComponent.prototype.updateBreadcrumbs = function (url) {
        this.breadcrumbs = this.getBreadcrumbs(url);
    };
    BreadcrumbComponent.prototype.getBreadcrumbs = function (url) {
        return this.breadcrumbService.generateBreadcrumbs(url);
    };
    BreadcrumbComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'breadcrumb',
                    templateUrl: './breadcrumb.component.html',
                    styleUrls: ['./breadcrumb.component.scss']
                },] },
    ];
    /** @nocollapse */
    BreadcrumbComponent.ctorParameters = function () { return [
        { type: BreadcrumbService, },
        { type: _angular_router.Router, },
        { type: _angular_router.ActivatedRoute, },
    ]; };
    return BreadcrumbComponent;
}());

var BreadcrumbModule = (function () {
    function BreadcrumbModule() {
    }
    BreadcrumbModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    declarations: [
                        BreadcrumbComponent
                    ],
                    providers: [
                        BreadcrumbService
                    ],
                    exports: [
                        BreadcrumbComponent
                    ],
                    imports: [_angular_common.CommonModule, _angular_router.RouterModule, _angular_material.MdIconModule, _angular_flexLayout.FlexLayoutModule]
                },] },
    ];
    /** @nocollapse */
    BreadcrumbModule.ctorParameters = function () { return []; };
    return BreadcrumbModule;
}());

var AccessDeniedComponent = (function () {
    function AccessDeniedComponent() {
    }
    AccessDeniedComponent.prototype.ngOnInit = function () {
    };
    AccessDeniedComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'app-access-denied',
                    templateUrl: './access-denied.component.html',
                    styleUrls: ['./access-denied.component.scss']
                },] },
    ];
    /** @nocollapse */
    AccessDeniedComponent.ctorParameters = function () { return []; };
    return AccessDeniedComponent;
}());

var AccessDeniedModule = (function () {
    function AccessDeniedModule() {
    }
    AccessDeniedModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    declarations: [
                        AccessDeniedComponent
                    ],
                    exports: [
                        AccessDeniedComponent
                    ],
                    imports: [_angular_common.CommonModule]
                },] },
    ];
    /** @nocollapse */
    AccessDeniedModule.ctorParameters = function () { return []; };
    return AccessDeniedModule;
}());

/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | bytes:precision
 * Example:
 *   {{ 1024 |  bytes}}
 *   formats to: 1 KB
 */
var BytesPipe = (function () {
    function BytesPipe() {
        this.units = [
            'bytes',
            'KB',
            'MB',
            'GB',
            'TB',
            'PB'
        ];
    }
    BytesPipe.prototype.transform = function (bytes, precision) {
        if (bytes === void 0) { bytes = 0; }
        if (precision === void 0) { precision = 2; }
        if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes))
            return '?';
        var unit = 0;
        while (bytes >= 1024) {
            bytes /= 1024;
            unit++;
        }
        return bytes.toFixed(+precision) + ' ' + this.units[unit];
    };
    BytesPipe.decorators = [
        { type: _angular_core.Pipe, args: [{ name: 'bytes' },] },
    ];
    /** @nocollapse */
    BytesPipe.ctorParameters = function () { return []; };
    return BytesPipe;
}());

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
        { type: _angular_core.Pipe, args: [{
                    name: 'timeAgo',
                    pure: false
                },] },
    ];
    /** @nocollapse */
    TimeAgoPipe.ctorParameters = function () { return [
        { type: _angular_core.ChangeDetectorRef, },
        { type: _angular_core.NgZone, },
    ]; };
    return TimeAgoPipe;
}());

var CommonPipesModule = (function () {
    function CommonPipesModule() {
    }
    CommonPipesModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    declarations: [
                        BytesPipe, TimeAgoPipe
                    ],
                    exports: [
                        BytesPipe, TimeAgoPipe
                    ],
                    imports: [_angular_common.CommonModule]
                },] },
    ];
    /** @nocollapse */
    CommonPipesModule.ctorParameters = function () { return []; };
    return CommonPipesModule;
}());

// Library Exports

/**
 * @module
 * @description
 * Entry point for all public APIs.
 */

exports.BreadcrumbModule = BreadcrumbModule;
exports.AccessDeniedModule = AccessDeniedModule;
exports.BytesPipe = BytesPipe;
exports.CommonPipesModule = CommonPipesModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
