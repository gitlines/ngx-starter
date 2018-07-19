import {HttpParams} from '@angular/common/http';
import {Objects} from '../objects';

export class Sort {

    public static NONE = new Sort(undefined, '');

    constructor (
        public readonly prop: string | undefined,
        public readonly dir: string
    ) { }

    public equals(other: Sort): boolean {
        return other && this.prop === other.prop && this.dir === other.dir;
    }
}

/**
 * @deprecated Switch to HttpParamsBuilder
 */
export class SortUtil {
    public static addSortQueryParams(params: HttpParams, sorts: Sort[]): HttpParams {
        if (sorts) {
            for (let sort of sorts.filter(s => Objects.nonNull(s.prop))) {
                params = params.append('sort', sort.prop + ',' + sort.dir);
            }
        }
        return params;
    }
}
