import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
var SortOption = (function () {
    function SortOption(id, name) {
        this.id = id;
        this.name = name;
    }
    return SortOption;
}());
export { SortOption };
/**
 * Represents the search query which the user has configured
 */
var SearchQuery = (function () {
    function SearchQuery(keywords, sorts) {
        this.keywords = keywords;
        this.sorts = sorts;
    }
    SearchQuery.Empty = new SearchQuery('', []);
    return SearchQuery;
}());
export { SearchQuery };
var GlobalSearchService = (function () {
    function GlobalSearchService(router) {
        var _this = this;
        this._showGlobalSearch = false;
        this._showGlobalSearchSubject = new Subject();
        this._querySubject = new Subject();
        this._availableSorts = new BehaviorSubject([]);
        router.events
            .filter(function (event) { return event instanceof NavigationEnd; })
            .map(function () { return router.routerState.root; })
            .map(function (route) {
            while (route.firstChild)
                route = route.firstChild;
            return route;
        })
            .filter(function (route) { return route.outlet === 'primary'; })
            .mergeMap(function (route) { return route.data; })
            .subscribe(function (currentRouteData) {
            //console.log('NavigationEnd:', currentRouteData);
            //console.log('show global search: ' + !!currentRouteData['showGlobalSearch']);
            _this.showGlobalSearch = !!currentRouteData['showGlobalSearch'];
        });
    }
    Object.defineProperty(GlobalSearchService.prototype, "availableSortsObservable", {
        get: function () {
            return this._availableSorts;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalSearchService.prototype, "availableSorts", {
        set: function (sorts) {
            this._availableSorts.next(sorts);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalSearchService.prototype, "queryObservable", {
        get: function () {
            return this._querySubject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalSearchService.prototype, "query", {
        get: function () {
            return this._query;
        },
        set: function (value) {
            this._query = value;
            this._querySubject.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalSearchService.prototype, "showGlobalSearchObservable", {
        get: function () {
            return this._showGlobalSearchSubject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalSearchService.prototype, "showGlobalSearch", {
        get: function () {
            return this._showGlobalSearch;
        },
        set: function (value) {
            this._showGlobalSearch = value;
            this._showGlobalSearchSubject.next(value);
        },
        enumerable: true,
        configurable: true
    });
    GlobalSearchService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    GlobalSearchService.ctorParameters = function () { return [
        { type: Router, },
    ]; };
    return GlobalSearchService;
}());
export { GlobalSearchService };
//# sourceMappingURL=global-search.service.js.map