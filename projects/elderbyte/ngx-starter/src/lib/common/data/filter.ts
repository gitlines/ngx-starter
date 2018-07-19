

import {HttpParams} from '@angular/common/http';
import {Objects} from '../objects';

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

    /**
     * @deprecated Switch to HttpParamsBuilder
     */
    public static addFilterQueryParams(params: HttpParams, filters: Filter[]): HttpParams {
        if (filters) {
            for (const filter of filters) {
                if (Objects.nonNull(filter.key) && Objects.nonNull(filter.value)) { // Ignore filters without a key/value specified
                    params = params.append(filter.key, filter.value);
                }
            }
        }
        return params;
    }
}

