import { Injectable } from "@angular/core";
var BreadcrumbContext = (function () {
    function BreadcrumbContext() {
        this.exactPathReplacers = new Map();
        this.exactPathHandlers = new Map();
        this.dynamicHandlers = [];
        this.replaceExactPath('/app', null);
    }
    BreadcrumbContext.prototype.replaceExactPath = function (exactPath, label) {
        this.exactPathReplacers.set(exactPath, label);
    };
    BreadcrumbContext.prototype.handleExactPath = function (exactPath, handler) {
        this.exactPathHandlers.set(exactPath, handler);
    };
    BreadcrumbContext.prototype.addDynamicHandler = function (handler) {
        this.dynamicHandlers.push(handler);
    };
    BreadcrumbContext.prototype.buildCrumb = function (url) {
        if (this.exactPathReplacers.has(url)) {
            var replacement = this.exactPathReplacers.get(url);
            if (replacement) {
                return this.build(url, replacement);
            }
            else {
                return null;
            }
        }
        var handler = this.exactPathHandlers.get(url);
        if (handler) {
            return handler(url);
        }
        for (var _i = 0, _a = this.dynamicHandlers; _i < _a.length; _i++) {
            var dh = _a[_i];
            var dynamicReplacement = dh(url);
            if (dynamicReplacement) {
                return dynamicReplacement;
            }
        }
        return this.buildCrumbFallback(url);
    };
    BreadcrumbContext.prototype.buildCrumbFallback = function (url) {
        var parts = url.split('/');
        var last = parts[parts.length - 1];
        last = last.split('(')[0];
        return this.build(url, last);
    };
    BreadcrumbContext.prototype.build = function (url, label) {
        return new Breadcrumb(label, url);
    };
    return BreadcrumbContext;
}());
export { BreadcrumbContext };
var Breadcrumb = (function () {
    function Breadcrumb(label, url) {
        this.label = label;
        this.url = url;
    }
    return Breadcrumb;
}());
export { Breadcrumb };
var BreadcrumbService = (function () {
    function BreadcrumbService() {
        this.context = new BreadcrumbContext();
    }
    BreadcrumbService.prototype.generateBreadcrumbs = function (url) {
        var crumbs = [];
        var beforeSubOutletsUrl = url.split('(')[0];
        this.generateBreadcrumbsRecursive(beforeSubOutletsUrl, crumbs);
        return crumbs;
    };
    BreadcrumbService.prototype.generateBreadcrumbsRecursive = function (url, crumbs) {
        var crumb = this.buildCrumb(url);
        if (crumb) {
            crumbs.unshift(crumb);
        }
        if (url.lastIndexOf('/') > 0) {
            this.generateBreadcrumbsRecursive(url.substr(0, url.lastIndexOf('/')), crumbs); //Find last '/' and add everything before it as a parent route
        }
        else if (this.context && this.context.prefix) {
            crumbs.unshift(this.context.prefix);
        }
    };
    BreadcrumbService.prototype.buildCrumb = function (url) {
        return this.context.buildCrumb(url);
    };
    BreadcrumbService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BreadcrumbService.ctorParameters = function () { return []; };
    return BreadcrumbService;
}());
export { BreadcrumbService };
//# sourceMappingURL=breadcrumb.service.js.map