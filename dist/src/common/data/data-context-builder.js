import { DataContext } from "./data-context";
import { PagedDataContext } from "./data-context-paged";
import { Observable } from "rxjs/Observable";
import { MaterialDataContext } from "./data-context-material";
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
        var emptyContext = new DataContext(function (a, b) { return Observable.empty(); });
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
export { DataContextBuilder };
//# sourceMappingURL=data-context-builder.js.map