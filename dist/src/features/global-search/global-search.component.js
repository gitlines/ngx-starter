import { Component, EventEmitter, Input, Output, ViewChild, } from "@angular/core";
import { GlobalSearchService, SearchQuery } from "./global-search.service";
import { NavigationEnd, Router } from "@angular/router";
import { Sort } from "../../common/data/page";
var GlobalSearchComponent = (function () {
    function GlobalSearchComponent(router, globalSearch) {
        var _this = this;
        this.router = router;
        this.globalSearch = globalSearch;
        this._searchCollapsed = true;
        this._subs = [];
        this.onSearchCollapsed = new EventEmitter();
        this.availableSort = [];
        this.selectedSort = this.availableSort[0];
        this.sortAsc = false;
        this.globalSearchDisabled = !globalSearch.showGlobalSearch;
        this._subs.push(globalSearch.showGlobalSearchObservable
            .subscribe(function (value) {
            _this.globalSearchDisabled = !value;
        }), this.globalSearch.availableSortsObservable
            .subscribe(function (available) {
            _this.availableSort = available;
        }), router.events
            .filter(function (event) { return event instanceof NavigationEnd; })
            .subscribe(function () {
            _this.searchCollapsed = true;
        }));
    }
    GlobalSearchComponent.prototype.ngOnInit = function () {
        this.searchCollapsed = true;
    };
    GlobalSearchComponent.prototype.ngOnDestroy = function () {
        this._subs.forEach(function (sub) { return sub.unsubscribe(); });
    };
    Object.defineProperty(GlobalSearchComponent.prototype, "searchCollapsed", {
        get: function () {
            return this._searchCollapsed;
        },
        set: function (value) {
            var _this = this;
            this._searchCollapsed = value;
            this.onSearchCollapsed.emit(this.searchCollapsed);
            if (!this._searchCollapsed) {
                setTimeout(function () { return _this._txtSearch.nativeElement.focus(); }, 0);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalSearchComponent.prototype, "txtSearch", {
        set: function (input) {
            this._txtSearch = input;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalSearchComponent.prototype, "toggleIcon", {
        get: function () {
            return this.searchCollapsed ? 'search' : 'close';
        },
        enumerable: true,
        configurable: true
    });
    GlobalSearchComponent.prototype.toggleSearch = function () {
        if (this.searchCollapsed) {
            // Show search
            this.searchCollapsed = false;
        }
        else {
            // Collapse search
            this.searchCollapsed = true;
            this.globalSearch.query = SearchQuery.Empty;
        }
    };
    GlobalSearchComponent.prototype.toggleSortAsc = function () {
        this.sortAsc = !this.sortAsc;
        this.onQueryChanged();
    };
    GlobalSearchComponent.prototype.sortBy = function (sort) {
        this.selectedSort = sort;
        this.onQueryChanged();
    };
    GlobalSearchComponent.prototype.onQueryChanged = function () {
        var sorts = this.selectedSort ? [this.convertToSort(this.selectedSort)] : [];
        var newQuery = new SearchQuery(this.keywordsValue, sorts);
        this.globalSearch.query = newQuery;
    };
    GlobalSearchComponent.prototype.convertToSort = function (sort) {
        return new Sort(sort.id, this.sortAsc ? 'asc' : 'desc');
    };
    Object.defineProperty(GlobalSearchComponent.prototype, "keywordsValue", {
        get: function () {
            if (this._txtSearch) {
                var txtInput = this._txtSearch.nativeElement;
                return txtInput.value;
            }
            return '';
        },
        enumerable: true,
        configurable: true
    });
    GlobalSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'global-search',
                    templateUrl: './global-search.component.html',
                    styleUrls: ['./global-search.component.scss']
                },] },
    ];
    /** @nocollapse */
    GlobalSearchComponent.ctorParameters = function () { return [
        { type: Router, },
        { type: GlobalSearchService, },
    ]; };
    GlobalSearchComponent.propDecorators = {
        'onSearchCollapsed': [{ type: Output },],
        'searchCollapsed': [{ type: Input },],
        'txtSearch': [{ type: ViewChild, args: ['txtSearch',] },],
    };
    return GlobalSearchComponent;
}());
export { GlobalSearchComponent };
//# sourceMappingURL=global-search.component.js.map