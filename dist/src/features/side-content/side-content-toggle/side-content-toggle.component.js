import { Component } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { SideContentService } from "../side-content.service";
var SideContentToggleComponent = (function () {
    function SideContentToggleComponent(router, sideContentService) {
        this.router = router;
        this.sideContentService = sideContentService;
    }
    SideContentToggleComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.router.events.subscribe(function (event) {
            if (event instanceof NavigationEnd) {
                var navEnd = event;
                var url = navEnd.url;
                var parts = url.split("/");
                var index = parts.indexOf("orders");
                if (index < 0 || index == parts.length - 1) {
                    _this.isMainRoute = true;
                }
                else {
                    _this.isMainRoute = false;
                }
            }
        });
    };
    SideContentToggleComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    SideContentToggleComponent.prototype.toggleSideContent = function () {
        this.sideContentService.toggleSidenav();
    };
    SideContentToggleComponent.prototype.goBack = function () {
        this.router.navigate(['app/orders']);
    };
    SideContentToggleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-side-content-toggle',
                    templateUrl: './side-content-toggle.component.html',
                    styleUrls: ['./side-content-toggle.component.scss']
                },] },
    ];
    /** @nocollapse */
    SideContentToggleComponent.ctorParameters = function () { return [
        { type: Router, },
        { type: SideContentService, },
    ]; };
    return SideContentToggleComponent;
}());
export { SideContentToggleComponent };
//# sourceMappingURL=side-content-toggle.component.js.map