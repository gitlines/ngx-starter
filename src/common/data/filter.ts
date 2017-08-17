

import {HttpParams} from '@angular/common/http';

export class Filter {
  constructor(
    public key: string,
    public value: string) {
  }
}


export class FilterUtil {

  public static addSearchParams(params: HttpParams, filters: Filter[]): HttpParams {
    for (let filter of filters) {
        params = params.append(filter.key, filter.value);
    }
    return params;
  }

}

