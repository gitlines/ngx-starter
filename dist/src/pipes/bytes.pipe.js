import { Pipe } from '@angular/core';
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
        { type: Pipe, args: [{ name: 'bytes' },] },
    ];
    /** @nocollapse */
    BytesPipe.ctorParameters = function () { return []; };
    return BytesPipe;
}());
export { BytesPipe };
//# sourceMappingURL=bytes.pipe.js.map