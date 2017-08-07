import { Component, Input, Output } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
var ExpandToggleButtonComponent = (function () {
    function ExpandToggleButtonComponent() {
        this._expandedChanged = new BehaviorSubject(false);
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
        { type: Component, args: [{
                    selector: 'expand-toggle-button',
                    templateUrl: './expand-toggle-button.component.html',
                    styleUrls: ['./expand-toggle-button.component.scss']
                },] },
    ];
    /** @nocollapse */
    ExpandToggleButtonComponent.ctorParameters = function () { return []; };
    ExpandToggleButtonComponent.propDecorators = {
        'name': [{ type: Input, args: ['name',] },],
        'expandedChanged': [{ type: Output, args: ['changed',] },],
        'isExpanded': [{ type: Input, args: ['expanded',] },],
    };
    return ExpandToggleButtonComponent;
}());
export { ExpandToggleButtonComponent };
//# sourceMappingURL=expand-toggle-button.component.js.map