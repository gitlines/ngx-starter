import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
/**
 * This service manages the side content.
 * This is usually the left side which is a 'side nav' and the right side which shows detail information.
 */
var SideContentService = (function () {
    function SideContentService(router) {
        var _this = this;
        this.router = router;
        this.navigationOpen = false;
        this.sideContentOpen = false;
        this.router.events
            .filter(function (event) { return event instanceof NavigationEnd; })
            .map(function (event) { return event; })
            .subscribe(function (event) {
            if (_this.isOutletActive('side')) {
                console.info('side outlet is active -> showing side content!');
                _this.showSideContent();
            }
            else {
                console.info('side outlet is NOT active -> HIDING side content!');
                _this.closeSideContent();
            }
            _this.closeSideNav();
        });
    }
    SideContentService.prototype.toggleSidenav = function () {
        this.navigationOpen = !this.navigationOpen;
    };
    SideContentService.prototype.closeSideNav = function () {
        this.navigationOpen = false;
    };
    SideContentService.prototype.closeSideContent = function () {
        console.log('hiding side content ...');
        this.sideContentOpen = false;
        this.router.navigate([{ outlets: { 'side': null } }]);
    };
    SideContentService.prototype.isOutletActive = function (outlet) {
        var rs = this.router.routerState.snapshot;
        var snap = rs.root;
        return this.isOutletActiveRecursive(snap, outlet);
    };
    SideContentService.prototype.isOutletActiveRecursive = function (root, outlet) {
        console.log('--> ' + root.outlet);
        if (root.outlet === outlet) {
            return true;
        }
        for (var _i = 0, _a = root.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (this.isOutletActiveRecursive(c, outlet)) {
                return true;
            }
        }
        return false;
    };
    SideContentService.prototype.showSideContent = function () {
        console.log('showing side content ...');
        this.sideContentOpen = true;
    };
    SideContentService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    SideContentService.ctorParameters = function () { return [
        { type: Router, },
    ]; };
    return SideContentService;
}());
export { SideContentService };
//# sourceMappingURL=side-content.service.js.map