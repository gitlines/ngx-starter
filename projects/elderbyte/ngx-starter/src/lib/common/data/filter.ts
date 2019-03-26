

import {HttpParams} from '@angular/common/http';
import {Objects} from '../objects';

export class Filter {

  public readonly key: string;
  public readonly value: string | null;

  constructor(
      key: string,
      value: string | null) {

    if (!key) { throw new Error('ArgumentNull: Filter.key can not be null!'); }

    this.key = key;
    this.value = value;
  }

  public get hasValue(): boolean {
    return Objects.nonNull(this.value);
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

