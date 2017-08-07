var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Observable } from "rxjs";
import { Pageable } from "./page";
import { DataContext } from "./data-context";
/**
 * Extends a simple flat list data-context with pagination support.
 *
 */
var PagedDataContext = (function (_super) {
    __extends(PagedDataContext, _super);
    function PagedDataContext(pageLoader, pageSize, _indexFn, _localSort) {
        var _this = _super.call(this, function () { return Observable.empty(); }, _indexFn, _localSort) || this;
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
export { PagedDataContext };
//# sourceMappingURL=data-context-paged.js.map