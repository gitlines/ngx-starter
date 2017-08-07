var Filter = (function () {
    function Filter(key, value) {
        this.key = key;
        this.value = value;
    }
    return Filter;
}());
export { Filter };
var FilterUtil = (function () {
    function FilterUtil() {
    }
    FilterUtil.addSearchParams = function (params, filters) {
        for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
            var filter = filters_1[_i];
            params.append(filter.key, filter.value);
        }
        return params;
    };
    return FilterUtil;
}());
export { FilterUtil };
//# sourceMappingURL=filter.js.map