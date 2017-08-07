import { URLSearchParams } from "@angular/http";
export declare class Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: any;
    first: boolean;
    numberOfElements: number;
    static from<TS>(data: TS[]): Page<TS>;
}
export declare class Sort {
    prop: string;
    dir: string;
    constructor(prop: string, dir: string);
}
export declare class Pageable {
    page: number;
    size: number;
    sorts?: Sort[];
    constructor(page: number, size: number, sorts?: Sort[]);
}
export declare class PageableUtil {
    static addSearchParams(params: URLSearchParams, pageable: Pageable): URLSearchParams;
}
