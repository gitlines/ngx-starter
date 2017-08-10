import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
var ToolbarHeader = (function () {
    function ToolbarHeader(name) {
        this.name = name;
    }
    return ToolbarHeader;
}());
export { ToolbarHeader };
var ToolbarService = (function () {
    function ToolbarService() {
        this._title = new ToolbarHeader('Home');
        this._titleChange = new BehaviorSubject(this._title);
    }
    Object.defineProperty(ToolbarService.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (title) {
            this._title = title;
            this._titleChange.next(title);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarService.prototype, "titleChange", {
        get: function () {
            return this._titleChange;
        },
        enumerable: true,
        configurable: true
    });
    ToolbarService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ToolbarService.ctorParameters = function () { return []; };
    return ToolbarService;
}());
export { ToolbarService };
//# sourceMappingURL=toolbar.service.js.map