import {HttpParams} from '@angular/common/http';

export class Sort {
    constructor (
        public readonly prop: string,
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
            for (let sort of sorts) {
                params = params.append('sort', sort.prop + ',' + sort.dir);
            }
        }
        return params;
    }
}
