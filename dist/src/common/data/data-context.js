import { BehaviorSubject } from "rxjs/BehaviorSubject";
var DataContext = (function () {
    function DataContext(listFetcher, _indexFn, _localSort) {
        this.listFetcher = listFetcher;
        this._indexFn = _indexFn;
        this._localSort = _localSort;
        this.total = 0;
        this._dataChange = new BehaviorSubject([]);
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
export { DataContext };
//# sourceMappingURL=data-context.js.map