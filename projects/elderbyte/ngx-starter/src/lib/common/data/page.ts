
import {HttpParams} from '@angular/common/http';
import {Sort, SortUtil} from './sort';

export class Page<T> {

    public content: T[];
    public totalElements: number;
    public totalPages: number;
    public last: boolean;
    public size: number;
    public number: number;
    public sort: any;
    public first: boolean;
    public numberOfElements: number;


    public static fromPage<TS>(data: TS[], total: number, pageable: Pageable) {
        const page = new Page<TS>();
        page.content = data;
        page.totalElements = total;
        page.totalPages = total / pageable.size;
        page.last = false;
        page.first = pageable.page === 0;
        page.size = data.length;
        page.number = pageable.page;
        page.numberOfElements = total;
        return page;
    }

    public static from<TS>(data: TS[]) {
        const page = new Page<TS>();
        page.content = data;
        page.totalElements = data.length;
        page.totalPages = 1;
        page.last = true;
        page.first = true;
        page.size = data.length;
        page.number = 0;
        page.numberOfElements = data.length;
        return page;
    }
}

export interface PageRequest {
    pageIndex: number;
    pageSize: number;
}

export class Pageable {

    public readonly page: number;
    public readonly size: number;
    public readonly sorts: Sort[] = [];

    constructor(
        page: number,
        size: number,
        sorts?: Sort[]) {

        this.page = page;
        this.size = size;
        this.sorts = sorts ? sorts : [];
    }
}

/**
 * @deprecated Switch to HttpParamsBuilder
 */
export class PageableUtil {
    public static addPageQueryParams(params: HttpParams, pageable: Pageable): HttpParams {
        params = params.set('page', pageable.page.toString());
        params = params.set('size', pageable.size.toString());
        SortUtil.addSortQueryParams(params, pageable.sorts);
        return params;
    }
}
