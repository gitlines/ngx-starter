import { Component } from "@angular/core";
import { ToolbarService } from "./toolbar.service";
var ToolbarTitleComponent = (function () {
    function ToolbarTitleComponent(toolbarService) {
        this.toolbarService = toolbarService;
    }
    ToolbarTitleComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._sub = this.toolbarService.titleChange
            .subscribe(function (title) { return _this.title = title.name; });
    };
    ToolbarTitleComponent.prototype.ngOnDestroy = function () {
        this._sub.unsubscribe();
    };
    ToolbarTitleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'toolbar-title',
                    templateUrl: './toolbar-title.component.html',
                    styleUrls: ['./toolbar-title.component.scss']
                },] },
    ];
    /** @nocollapse */
    ToolbarTitleComponent.ctorParameters = function () { return [
        { type: ToolbarService, },
    ]; };
    return ToolbarTitleComponent;
}());
export { ToolbarTitleComponent };
//# sourceMappingURL=toolbar-title.component.js.map