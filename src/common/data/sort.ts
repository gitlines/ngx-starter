import {HttpParams} from '@angular/common/http';

export class Sort {
    constructor (
        public readonly prop: string,
        public readonly dir: string
    ) { }
}

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
