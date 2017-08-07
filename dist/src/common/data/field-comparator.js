/**
 * Created by isnull on 22.03.17.
 */
/**
 * Provides the ability to build a sorting comparator dynamically using
 * a given array of fields / additional syntax.
 *
 * - Supports ASC / DESC
 * - Supports multiple fields
 * - Supports nested fields
 *
 * Example:
 *
 * ComparatorBuilder.fieldSort('simple', '-reveresed', 'some.very.deep.nested.path')
 *
 */
var ComparatorBuilder = (function () {
    function ComparatorBuilder() {
    }
    /**
     * Dynamically builds a comparator function, using the given fields for sorting.
     *
     * @param fields One or more field name to sort.
     * @returns {(obj1:any, obj2:any)=>number}
     */
    ComparatorBuilder.fieldSort = function () {
        var fields = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
        }
        var props = fields;
        return function (obj1, obj2) {
            var i = 0, result = 0, numberOfProperties = props.length;
            /* try getting a different result from 0 (equal)
             * as long as we have extra properties to compare
             */
            while (result === 0 && i < numberOfProperties) {
                result = ComparatorBuilder.dynamicSort(props[i])(obj1, obj2);
                i++;
            }
            return result;
        };
    };
    ComparatorBuilder.dynamicSort = function (property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var aValue = ComparatorBuilder.resolveProperty(a, property);
            var bValue = ComparatorBuilder.resolveProperty(b, property);
            var result = (aValue < bValue) ? -1 : (aValue > bValue) ? 1 : 0;
            return result * sortOrder;
        };
    };
    ComparatorBuilder.resolveProperty = function (obj, property) {
        var parts = property.split('.');
        var resolved = obj;
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            resolved = resolved[part];
        }
        return resolved;
    };
    return ComparatorBuilder;
}());
export { ComparatorBuilder };
//# sourceMappingURL=field-comparator.js.map