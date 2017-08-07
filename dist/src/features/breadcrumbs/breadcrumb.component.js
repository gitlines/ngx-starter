import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { BreadcrumbService } from "./breadcrumb.service";
var BreadcrumbComponent = (function () {
    /**
     * @class DetailComponent
     * @constructor
     */
    function BreadcrumbComponent(breadcrumbService, router, route) {
        this.breadcrumbService = breadcrumbService;
        this.router = router;
        this.route = route;
        this.ROUTE_DATA_BREADCRUMB = "breadcrumb";
        this.breadcrumbs = [];
    }
    /**
     * Let's go!
     *
     * @class DetailComponent
     * @method ngOnInit
     */
    BreadcrumbComponent.prototype.ngOnInit = function () {
        var _this = this;
        //subscribe to the NavigationEnd event
        this.router.events
            .filter(function (event) { return event instanceof NavigationEnd; })
            .map(function (event) { return event; })
            .subscribe(function (event) {
            var url = event.urlAfterRedirects ? event.urlAfterRedirects : event.url;
            _this.updateBreadcrumbs(url);
        });
        this.updateBreadcrumbs(location.pathname);
    };
    BreadcrumbComponent.prototype.updateBreadcrumbs = function (url) {
        this.breadcrumbs = this.getBreadcrumbs(url);
    };
    BreadcrumbComponent.prototype.getBreadcrumbs = function (url) {
        return this.breadcrumbService.generateBreadcrumbs(url);
    };
    BreadcrumbComponent.decorators = [
        { type: Component, args: [{
                    selector: 'breadcrumb',
                    templateUrl: './breadcrumb.component.html',
                    styleUrls: ['./breadcrumb.component.scss']
                },] },
    ];
    /** @nocollapse */
    BreadcrumbComponent.ctorParameters = function () { return [
        { type: BreadcrumbService, },
        { type: Router, },
        { type: ActivatedRoute, },
    ]; };
    return BreadcrumbComponent;
}());
export { BreadcrumbComponent };
//# sourceMappingURL=breadcrumb.component.js.map