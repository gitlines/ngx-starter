import {HttpParams} from '@angular/common/http';
import {Filter} from './filter';
import {Sort} from './sort';
import {Pageable} from './page';
import {Objects} from '../objects';
import {TokenChunkRequest} from './token-chunk-request';


export class HttpParamsBuilder {

    private params: HttpParams;

    public static start(params?: HttpParams): HttpParamsBuilder {
        return new HttpParamsBuilder(params);
    }

    constructor(params?: HttpParams) {
        this.params = params ? params : new HttpParams();
    }

    public appendFilters(filters?: Filter[]): this {
        if (filters) {
            for (const filter of filters) {
                if (filter && filter.hasValue) {
                  // Ignore filtersSnapshot without a value specified
                  this.append(filter.key, filter.value);
                }
            }
        }
        return this;
    }

    public appendFilter(...filters: Filter[]): this {
        return this.appendFilters(filters);
    }

    public appendSorts(sorts?: Sort[]): this {
        if (sorts) {
            for (const sort of sorts) {
                if (sort && Objects.nonNull(sort.prop)) {
                    this.append('sort', sort.prop + ',' + sort.dir);
                }
            }
        }
        return this;
    }

    public appendSort(...sorts: Sort[]): this  {
        return this.appendSorts(sorts);
    }

    public appendPageable(pageable?: Pageable): this  {
        if (pageable) {
            this.append('page', pageable.page.toString())
                .append('size', pageable.size.toString())
                .appendSorts(pageable.sorts);
        }
        return this;
    }

    public appendContinuationRequest(tokenChunkRequest?: TokenChunkRequest): this  {
        if (tokenChunkRequest) {
            if (tokenChunkRequest.nextContinuationToken) {
                this.append('continuationToken', tokenChunkRequest.nextContinuationToken);
            }
            this.appendFilters(tokenChunkRequest.filters);
            this.appendSorts(tokenChunkRequest.sorts);
        }
        return this;
    }


    public append(key: string, value: string): this {
        this.params = this.params.append(key, value);
        return this;
    }

    public build(): HttpParams {
        return this.params;
    }
}
