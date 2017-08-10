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
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Request, URLSearchParams, } from "@angular/http";
import { TranslateService } from "@ngx-translate/core";
import { AuthConfig, AuthHttp } from "angular2-jwt";
import { PageableUtil } from "../../common/data/page";
import { FilterUtil } from "../../common/data/filter";
var CustomHttpService = (function (_super) {
    __extends(CustomHttpService, _super);
    function CustomHttpService(backend, options, authConfig, translate) {
        var _this = _super.call(this, authConfig ? authConfig : new AuthConfig(), backend, options) || this;
        _this.translate = translate;
        return _this;
    }
    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/
    CustomHttpService.prototype.request = function (request, options) {
        if (request instanceof Request) {
            return _super.prototype.request.call(this, request);
        }
        else {
            return _super.prototype.request.call(this, request, this.handleOptions(options));
        }
    };
    CustomHttpService.prototype.get = function (url, options, pageable, filters) {
        return _super.prototype.get.call(this, url, this.handleOptions(options, pageable, filters));
    };
    CustomHttpService.prototype.post = function (url, body, options) {
        return _super.prototype.post.call(this, url, body, this.handleOptions(options));
    };
    CustomHttpService.prototype.put = function (url, body, options) {
        return _super.prototype.put.call(this, url, body, this.handleOptions(options));
    };
    CustomHttpService.prototype.delete = function (url, options) {
        return _super.prototype.delete.call(this, url, this.handleOptions(options));
    };
    CustomHttpService.prototype.patch = function (url, body, options) {
        return _super.prototype.patch.call(this, url, body, this.handleOptions(options));
    };
    CustomHttpService.prototype.head = function (url, options) {
        return _super.prototype.head.call(this, url, this.handleOptions(options));
    };
    CustomHttpService.prototype.options = function (url, options) {
        return _super.prototype.options.call(this, url, this.handleOptions(options));
    };
    /***************************************************************************
     *                                                                         *
     * Private Methods                                                         *
     *                                                                         *
     **************************************************************************/
    CustomHttpService.prototype.handleOptions = function (options, pageable, filters) {
        if (!options) {
            options = {};
        }
        if (pageable) {
            options = this.addPageable(options, pageable);
        }
        if (filters) {
            options = this.addFilters(options, filters);
        }
        options = this.addLocale(options);
        //console.log('injected options: ', options);
        return options;
    };
    CustomHttpService.prototype.addLocale = function (options) {
        var params;
        if (options.params) {
            params = options.params;
        }
        else {
            params = new URLSearchParams();
        }
        params.set('locale', this.translate.currentLang);
        options.params = params;
        return options;
    };
    CustomHttpService.prototype.addPageable = function (options, pageable) {
        var params;
        if (options.params) {
            params = options.params;
        }
        else {
            params = new URLSearchParams();
        }
        options.params = PageableUtil.addSearchParams(params, pageable);
        return options;
    };
    CustomHttpService.prototype.addFilters = function (options, filters) {
        var params;
        if (options.params) {
            params = options.params;
        }
        else {
            params = new URLSearchParams();
        }
        options.params = FilterUtil.addSearchParams(params, filters);
        return options;
    };
    CustomHttpService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CustomHttpService.ctorParameters = function () { return [
        { type: Http, },
        { type: RequestOptions, },
        null,
        { type: TranslateService, },
    ]; };
    return CustomHttpService;
}(AuthHttp));
export { CustomHttpService };
//# sourceMappingURL=custom-http.service.js.map