export declare class Filter {
    key: string;
    value: string;
    constructor(key: string, value: string);
}
export declare class FilterUtil {
    static addSearchParams(params: URLSearchParams, filters: Filter[]): URLSearchParams;
}
