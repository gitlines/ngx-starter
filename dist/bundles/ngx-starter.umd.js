(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/BehaviorSubject'), require('rxjs'), require('rxjs/Observable'), require('@angular/cdk'), require('@angular/common'), require('@angular/core'), require('@angular/material'), require('@angular/flex-layout'), require('@angular/router'), require('@ngx-translate/core')) :
	typeof define === 'function' && define.amd ? define(['exports', 'rxjs/BehaviorSubject', 'rxjs', 'rxjs/Observable', '@angular/cdk', '@angular/common', '@angular/core', '@angular/material', '@angular/flex-layout', '@angular/router', '@ngx-translate/core'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.ngxStarter = global.ng.ngxStarter || {}),global.rxjs_BehaviorSubject,global.rxjs,global.rxjs_Observable,global._angular_cdk,global._angular_common,global.ng.core,global._angular_material,global._angular_flexLayout,global.ng.router,global._ngxTranslate_core));
}(this, (function (exports,rxjs_BehaviorSubject,rxjs,rxjs_Observable,_angular_cdk,_angular_common,_angular_core,_angular_material,_angular_flexLayout,_angular_router,_ngxTranslate_core) { 'use strict';

var DataContext = (function () {
    function DataContext(listFetcher, _indexFn, _localSort) {
        this.listFetcher = listFetcher;
        this._indexFn = _indexFn;
        this._localSort = _localSort;
        this.total = 0;
        this._dataChange = new rxjs_BehaviorSubject.BehaviorSubject([]);
        this._primaryIndex = new Map();
        this.rows = [];
        this.sorts = [];
    }
    DataContext.prototype.start = function (sorts, filters) {
        this.total = 0;
        this.rows = [];
        this.sorts = sorts;
        this.filters = filters;
        this.loadData();
    };
    Object.defineProperty(DataContext.prototype, "hasMoreData", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    DataContext.prototype.loadMore = function () {
        // NOP
    };
    DataContext.prototype.findByIndex = function (key) {
        if (!this._indexFn)
            throw new Error("findByIndex requires you to pass a index function!");
        return this._primaryIndex.get(key);
    };
    Object.defineProperty(DataContext.prototype, "rowsChanged", {
        get: function () {
            return this._dataChange;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataContext.prototype, "rows", {
        get: function () {
            return this._rows;
        },
        set: function (rows) {
            if (this._localSort) {
                rows.sort(this._localSort);
            }
            this._rows = rows;
            console.info('rows changed data-change: ' + this._rows.length);
            this._dataChange.next(rows);
        },
        enumerable: true,
        configurable: true
    });
    // Private methods
    DataContext.prototype.updateIndex = function () {
        var _this = this;
        this._primaryIndex.clear();
        this.rows.forEach(function (item) { return _this.indexItem(item); });
    };
    DataContext.prototype.indexItem = function (item) {
        var key = this.getItemKey(item);
        if (key) {
            this._primaryIndex.set(key, item);
        }
    };
    DataContext.prototype.getItemKey = function (item) {
        if (this._indexFn) {
            return this._indexFn(item);
        }
        return null;
    };
    DataContext.prototype.loadData = function () {
        var _this = this;
        this.loadingIndicator = true;
        if (this.listFetcher) {
            this.listFetcher(this.sorts, this.filters)
                .take(1)
                .subscribe(function (list) {
                _this.total = list.length;
                _this.rows = list;
                _this.loadingIndicator = false;
                console.log('got list data!');
            }, function (err) {
                _this.total = 0;
                _this.rows = [];
                _this.loadingIndicator = false;
                _this.updateIndex();
                console.error('Failed to query data', err);
            });
        }
        else {
            console.warn('Skipping data context load - no list fetcher present!');
        }
    };
    return DataContext;
}());

var Page = (function () {
    function Page() {
    }
    Page.from = function (data) {
        var page = new Page();
        page.content = data;
        page.totalElements = data.length;
        page.totalPages = 1;
        page.last = true;
        page.first = true;
        page.size = data.length;
        page.number = 0;
        page.numberOfElements = data.length;
        return page;
    };
    return Page;
}());
var Sort = (function () {
    function Sort(prop, dir) {
        this.prop = prop;
        this.dir = dir;
    }
    return Sort;
}());
var Pageable = (function () {
    function Pageable(page, size, sorts) {
        this.page = page;
        this.size = size;
        this.sorts = sorts;
    }
    return Pageable;
}());
var PageableUtil = (function () {
    function PageableUtil() {
    }
    PageableUtil.addSearchParams = function (params, pageable) {
        params.set('page', pageable.page.toString());
        params.set('size', pageable.size.toString());
        if (pageable.sorts) {
            for (var _i = 0, _a = pageable.sorts; _i < _a.length; _i++) {
                var sort = _a[_i];
                params.append('sort', sort.prop + ',' + sort.dir);
            }
        }
        return params;
    };
    return PageableUtil;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Extends a simple flat list data-context with pagination support.
 *
 */
var PagedDataContext = (function (_super) {
    __extends(PagedDataContext, _super);
    function PagedDataContext(pageLoader, pageSize, _indexFn, _localSort) {
        var _this = _super.call(this, function () { return rxjs.Observable.empty(); }, _indexFn, _localSort) || this;
        _this.pageLoader = pageLoader;
        _this.pageCache = new Map();
        _this.latestPage = 0;
        _this.offset = 0;
        _this.limit = 30;
        _this.limit = pageSize;
        return _this;
    }
    /**
     * Resets the data-context to a new filter / sorting strategy.
     * All current data will be discarded.
     *
     * @param {Sort[]} sorts
     * @param {Filter[]} filters
     */
    PagedDataContext.prototype.start = function (sorts, filters) {
        this.total = 0;
        this.rows = [];
        this.pageCache = new Map();
        this.sorts = sorts;
        this.filters = filters;
        this.fetchPage(0, this.limit);
    };
    /**
     * Load the next chunk of data.
     * Useful for infinite scroll like data flows.
     *
     */
    PagedDataContext.prototype.loadMore = function () {
        if (this.hasMoreData) {
            console.log("loading more..." + this.latestPage);
            if (this.loadingIndicator)
                return;
            var nextPage = this.latestPage + 1;
            this.fetchPage(nextPage, this.limit);
        }
    };
    Object.defineProperty(PagedDataContext.prototype, "hasMoreData", {
        get: function () {
            return this.total > this.rows.length;
        },
        enumerable: true,
        configurable: true
    });
    PagedDataContext.prototype.fetchPage = function (pageIndex, pageSize) {
        var _this = this;
        var pageRequest = new Pageable(pageIndex, pageSize, this.sorts);
        if (this.pageCache.has(pageIndex)) {
            // Page already loaded - skipping request!
        }
        else {
            this.loadingIndicator = true;
            console.log("loading page " + pageIndex + " using sort:", this.sorts);
            var page = this.pageLoader(pageRequest, this.filters);
            this.pageCache.set(pageIndex, page);
            page.subscribe(function (page) {
                console.log("Got data: ", page);
                _this.populatePageData(page);
                if (_this.latestPage < page.number) {
                    _this.latestPage = page.number; // TODO This might cause that pages are skipped
                }
                _this.loadingIndicator = false;
            }, function (err) {
                _this.loadingIndicator = false;
                console.error('Failed to query data', err);
            });
        }
    };
    /**
     * Load the data from the given page into the current data context
     * @param {Page<T>} page
     */
    PagedDataContext.prototype.populatePageData = function (page) {
        try {
            this.total = page.totalElements;
            var start = page.number * page.size;
            var newRows = this.rows.slice();
            for (var i = 0; i < page.content.length; i++) {
                var item = page.content[i];
                newRows[i + start] = item;
                this.indexItem(item);
            }
            this.rows = newRows;
        }
        catch (err) {
            console.error('Failed to populate data with page', page, err);
        }
    };
    return PagedDataContext;
}(DataContext));

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Adapter for a data-context for the Angular Material DataSource
 */
var MaterialDataContext = (function (_super) {
    __extends$1(MaterialDataContext, _super);
    function MaterialDataContext(datacontext) {
        var _this = _super.call(this) || this;
        _this.datacontext = datacontext;
        if (!datacontext)
            throw Error('datacontext must not be NULL!');
        return _this;
    }
    MaterialDataContext.prototype.connect = function (collectionViewer) {
        return this.datacontext.rowsChanged;
    };
    MaterialDataContext.prototype.disconnect = function (collectionViewer) {
    };
    Object.defineProperty(MaterialDataContext.prototype, "rows", {
        get: function () { return this.datacontext.rows; },
        set: function (data) { this.datacontext.rows = data; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialDataContext.prototype, "total", {
        get: function () { return this.datacontext.total; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialDataContext.prototype, "sorts", {
        get: function () { return this.datacontext.sorts; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialDataContext.prototype, "filters", {
        get: function () { return this.datacontext.filters; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialDataContext.prototype, "loadingIndicator", {
        get: function () { return this.datacontext.loadingIndicator; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialDataContext.prototype, "rowsChanged", {
        get: function () { return this.datacontext.rowsChanged; },
        enumerable: true,
        configurable: true
    });
    MaterialDataContext.prototype.start = function (sorts, filters) {
        this.datacontext.start(sorts, filters);
    };
    MaterialDataContext.prototype.findByIndex = function (key) {
        return this.datacontext.findByIndex(key);
    };
    Object.defineProperty(MaterialDataContext.prototype, "hasMoreData", {
        get: function () {
            return this.datacontext.hasMoreData;
        },
        enumerable: true,
        configurable: true
    });
    MaterialDataContext.prototype.loadMore = function () {
        this.datacontext.loadMore();
    };
    return MaterialDataContext;
}(_angular_cdk.DataSource));

var DataContextBuilder = (function () {
    function DataContextBuilder() {
        this._pageSize = 30;
        this._materialSupport = false;
    }
    DataContextBuilder.start = function () {
        return new DataContextBuilder();
    };
    DataContextBuilder.prototype.indexBy = function (indexFn) {
        this._indexFn = indexFn;
        return this;
    };
    DataContextBuilder.prototype.pageSize = function (size) {
        this._pageSize = size;
        return this;
    };
    /**
     * Adds support for Material DataSource to the resulting DataContext
     * @returns {DataContextBuilder<T>}
     */
    DataContextBuilder.prototype.mdDataSource = function () {
        this._materialSupport = true;
        return this;
    };
    DataContextBuilder.prototype.localSorted = function (localSort) {
        this._localSort = localSort;
        return this;
    };
    DataContextBuilder.prototype.build = function (listFetcher) {
        return this.applyProxies(new DataContext(listFetcher, this._indexFn));
    };
    DataContextBuilder.prototype.buildPaged = function (pageLoader) {
        return this.applyProxies(new PagedDataContext(pageLoader, this._pageSize, this._indexFn));
    };
    DataContextBuilder.prototype.buildEmpty = function () {
        var emptyContext = new DataContext(function (a, b) { return rxjs_Observable.Observable.empty(); });
        return this.applyProxies(emptyContext);
    };
    DataContextBuilder.prototype.applyProxies = function (context) {
        if (this._materialSupport) {
            context = new MaterialDataContext(context);
        }
        return context;
    };
    return DataContextBuilder;
}());

/**
 * Created by isnull on 22.03.17.
 */
/**
 * Provides the ability to build a sorting comparator dynamically using
 * a given array of fields / additional syntax.
 *
 * - Supports ASC / DESC
 * - Supports multiple fields
 * - Supports nested fields
 *
 * Example:
 *
 * ComparatorBuilder.fieldSort('simple', '-reveresed', 'some.very.deep.nested.path')
 *
 */
var ComparatorBuilder = (function () {
    function ComparatorBuilder() {
    }
    /**
     * Dynamically builds a comparator function, using the given fields for sorting.
     *
     * @param fields One or more field name to sort.
     * @returns {(obj1:any, obj2:any)=>number}
     */
    ComparatorBuilder.fieldSort = function () {
        var fields = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
        }
        var props = fields;
        return function (obj1, obj2) {
            var i = 0, result = 0, numberOfProperties = props.length;
            /* try getting a different result from 0 (equal)
             * as long as we have extra properties to compare
             */
            while (result === 0 && i < numberOfProperties) {
                result = ComparatorBuilder.dynamicSort(props[i])(obj1, obj2);
                i++;
            }
            return result;
        };
    };
    ComparatorBuilder.dynamicSort = function (property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var aValue = ComparatorBuilder.resolveProperty(a, property);
            var bValue = ComparatorBuilder.resolveProperty(b, property);
            var result = (aValue < bValue) ? -1 : (aValue > bValue) ? 1 : 0;
            return result * sortOrder;
        };
    };
    ComparatorBuilder.resolveProperty = function (obj, property) {
        var parts = property.split('.');
        var resolved = obj;
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            resolved = resolved[part];
        }
        return resolved;
    };
    return ComparatorBuilder;
}());

var Filter = (function () {
    function Filter(key, value) {
        this.key = key;
        this.value = value;
    }
    return Filter;
}());
var FilterUtil = (function () {
    function FilterUtil() {
    }
    FilterUtil.addSearchParams = function (params, filters) {
        for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
            var filter = filters_1[_i];
            params.append(filter.key, filter.value);
        }
        return params;
    };
    return FilterUtil;
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

var ExpandToggleButtonComponent = (function () {
    function ExpandToggleButtonComponent() {
        this._expandedChanged = new rxjs_BehaviorSubject.BehaviorSubject(false);
    }
    ExpandToggleButtonComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(ExpandToggleButtonComponent.prototype, "expandedChanged", {
        get: function () {
            return this._expandedChanged;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExpandToggleButtonComponent.prototype, "isExpanded", {
        get: function () {
            return this._isExpanded;
        },
        set: function (value) {
            this._isExpanded = value;
            this._expandedChanged.next(value);
        },
        enumerable: true,
        configurable: true
    });
    ExpandToggleButtonComponent.prototype.onToggleExpand = function (event) {
        this.isExpanded = !this.isExpanded;
    };
    ExpandToggleButtonComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'expand-toggle-button',
                    templateUrl: './expand-toggle-button.component.html',
                    styleUrls: ['./expand-toggle-button.component.scss']
                },] },
    ];
    /** @nocollapse */
    ExpandToggleButtonComponent.ctorParameters = function () { return []; };
    ExpandToggleButtonComponent.propDecorators = {
        'name': [{ type: _angular_core.Input, args: ['name',] },],
        'expandedChanged': [{ type: _angular_core.Output, args: ['changed',] },],
        'isExpanded': [{ type: _angular_core.Input, args: ['expanded',] },],
    };
    return ExpandToggleButtonComponent;
}());

var ExpandToggleButtonModule = (function () {
    function ExpandToggleButtonModule() {
    }
    ExpandToggleButtonModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [
                        _angular_common.CommonModule, _angular_material.MdButtonModule, _angular_material.MdIconModule, _angular_flexLayout.FlexLayoutModule
                    ],
                    declarations: [
                        ExpandToggleButtonComponent
                    ],
                    exports: [
                        ExpandToggleButtonComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    ExpandToggleButtonModule.ctorParameters = function () { return []; };
    return ExpandToggleButtonModule;
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

var ConfirmDialog = (function () {
    function ConfirmDialog(dialogRef) {
        this.dialogRef = dialogRef;
    }
    ConfirmDialog.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'confirm-dialog',
                    templateUrl: './confirm-dialog.component.html',
                    styleUrls: ['./confirm-dialog.component.scss'],
                },] },
    ];
    /** @nocollapse */
    ConfirmDialog.ctorParameters = function () { return [
        { type: _angular_material.MdDialogRef, },
    ]; };
    return ConfirmDialog;
}());

var CommonDialogService = (function () {
    function CommonDialogService(dialog) {
        this.dialog = dialog;
    }
    CommonDialogService.prototype.confirm = function (title, message) {
        var dialogRef;
        dialogRef = this.dialog.open(ConfirmDialog);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        return dialogRef.afterClosed();
    };
    CommonDialogService.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    CommonDialogService.ctorParameters = function () { return [
        { type: _angular_material.MdDialog, },
    ]; };
    return CommonDialogService;
}());

var CommonDialogModule = (function () {
    function CommonDialogModule() {
    }
    CommonDialogModule.forRoot = function () {
        return {
            ngModule: CommonDialogModule,
            providers: [
                {
                    provide: CommonDialogService,
                    useClass: CommonDialogService
                },
            ]
        };
    };
    CommonDialogModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [
                        _ngxTranslate_core.TranslateModule,
                        _angular_material.MdDialogModule,
                        _angular_material.MdButtonModule
                    ],
                    exports: [
                        ConfirmDialog,
                    ],
                    declarations: [
                        ConfirmDialog,
                    ],
                    entryComponents: [
                        ConfirmDialog
                    ],
                },] },
    ];
    /** @nocollapse */
    CommonDialogModule.ctorParameters = function () { return []; };
    return CommonDialogModule;
}());

// Library Exports

/**
 * @module
 * @description
 * Entry point for all public APIs.
 */

exports.DataContext = DataContext;
exports.DataContextBuilder = DataContextBuilder;
exports.MaterialDataContext = MaterialDataContext;
exports.PagedDataContext = PagedDataContext;
exports.ComparatorBuilder = ComparatorBuilder;
exports.Filter = Filter;
exports.FilterUtil = FilterUtil;
exports.Page = Page;
exports.Sort = Sort;
exports.Pageable = Pageable;
exports.PageableUtil = PageableUtil;
exports.CommonPipesModule = CommonPipesModule;
exports.BytesPipe = BytesPipe;
exports.TimeAgoPipe = TimeAgoPipe;
exports.ExpandToggleButtonModule = ExpandToggleButtonModule;
exports.ExpandToggleButtonComponent = ExpandToggleButtonComponent;
exports.AccessDeniedModule = AccessDeniedModule;
exports.AccessDeniedComponent = AccessDeniedComponent;
exports.BreadcrumbModule = BreadcrumbModule;
exports.BreadcrumbService = BreadcrumbService;
exports.BreadcrumbComponent = BreadcrumbComponent;
exports.CommonDialogModule = CommonDialogModule;
exports.CommonDialogService = CommonDialogService;
exports.ConfirmDialog = ConfirmDialog;

Object.defineProperty(exports, '__esModule', { value: true });

})));
