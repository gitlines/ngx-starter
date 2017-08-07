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
import { DataSource } from "@angular/cdk";
/**
 * Adapter for a data-context for the Angular Material DataSource
 */
var MaterialDataContext = (function (_super) {
    __extends(MaterialDataContext, _super);
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
}(DataSource));
export { MaterialDataContext };
//# sourceMappingURL=data-context-material.js.map