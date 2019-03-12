

import {HttpParams} from '@angular/common/http';
import {Objects} from '../objects';

export class Filter {

  public readonly key: string;
  public readonly value: string;

  constructor(
      key: string,
      value: string) {
    this.key = key;
    this.value = value;
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
                if (Objects.nonNull(filter.key) && Objects.nonNull(filter.value)) { // Ignore filtersSnapshot without a key/value specified
                    params = params.append(filter.key, filter.value);
                }
            }
        }
        return params;
    }
}

