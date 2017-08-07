var Page = (function () {
    function Page() {
    }
    Page.from = function (data) {
        var page = new Page();
        page.content = data;
        page.totalElements = data.length;
        page.totalPages = 1;
        page.last = true;
        page.first = true;
        page.size = data.length;
        page.number = 0;
        page.numberOfElements = data.length;
        return page;
    };
    return Page;
}());
export { Page };
var Sort = (function () {
    function Sort(prop, dir) {
        this.prop = prop;
        this.dir = dir;
    }
    return Sort;
}());
export { Sort };
var Pageable = (function () {
    function Pageable(page, size, sorts) {
        this.page = page;
        this.size = size;
        this.sorts = sorts;
    }
    return Pageable;
}());
export { Pageable };
var PageableUtil = (function () {
    function PageableUtil() {
    }
    PageableUtil.addSearchParams = function (params, pageable) {
        params.set('page', pageable.page.toString());
        params.set('size', pageable.size.toString());
        if (pageable.sorts) {
            for (var _i = 0, _a = pageable.sorts; _i < _a.length; _i++) {
                var sort = _a[_i];
                params.append('sort', sort.prop + ',' + sort.dir);
            }
        }
        return params;
    };
    return PageableUtil;
}());
export { PageableUtil };
//# sourceMappingURL=page.js.map