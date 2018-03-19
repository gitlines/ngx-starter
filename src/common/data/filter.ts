

import {HttpParams} from '@angular/common/http';

export class Filter {
    constructor(
        public key: string,
        public value: string) {
    }
}


/**
 * @deprecated Switch to HttpParamsBuilder
 */
export class FilterUtil {

    public static addFilterQueryParams(params: HttpParams, filters: Filter[]): HttpParams {
        if (filters) {
            for (let filter of filters) {
                if (filter.value) { // Ignore filters without a value specified
                    params = params.append(filter.key, filter.value);
                }
            }
        }
        return params;
    }

}

