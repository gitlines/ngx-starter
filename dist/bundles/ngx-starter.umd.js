(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.ngxStarter = global.ng.ngxStarter || {}),global.ng.core,global._angular_common));
}(this, (function (exports,_angular_core,_angular_common) { 'use strict';

/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | bytes:precision
 * Example:
 *   {{ 1024 |  bytes}}
 *   formats to: 1 KB
 */
var BytesPipe = (function () {
    function BytesPipe() {
        this.units = [
            'bytes',
            'KB',
            'MB',
            'GB',
            'TB',
            'PB'
        ];
    }
    BytesPipe.prototype.transform = function (bytes, precision) {
        if (bytes === void 0) { bytes = 0; }
        if (precision === void 0) { precision = 2; }
        if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes))
            return '?';
        var unit = 0;
        while (bytes >= 1024) {
            bytes /= 1024;
            unit++;
        }
        return bytes.toFixed(+precision) + ' ' + this.units[unit];
    };
    BytesPipe.decorators = [
        { type: _angular_core.Pipe, args: [{ name: 'bytes' },] },
    ];
    /** @nocollapse */
    BytesPipe.ctorParameters = function () { return []; };
    return BytesPipe;
}());

var CommonPipesModule = (function () {
    function CommonPipesModule() {
    }
    CommonPipesModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    declarations: [
                        BytesPipe
                    ],
                    exports: [
                        BytesPipe
                    ],
                    imports: [_angular_common.CommonModule]
                },] },
    ];
    /** @nocollapse */
    CommonPipesModule.ctorParameters = function () { return []; };
    return CommonPipesModule;
}());

// Library Exports

/**
 * @module
 * @description
 * Entry point for all public APIs.
 */

exports.BytesPipe = BytesPipe;
exports.CommonPipesModule = CommonPipesModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
