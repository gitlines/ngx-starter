import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Page, Pageable, PageableUtil} from '../../common/data/page';
import {Filter, FilterUtil} from '../../common/data/filter';
import {HttpClient, HttpParams} from '@angular/common/http';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {HttpParamsBuilder} from '../../common/data/http-params-builder';



@Injectable()
export class HttpPagedClient {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger = LoggerFactory.getLogger('HttpPagedClient');

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    /**
     * Creates a new HttpPagedClient service
     */
    constructor(
        private http: HttpClient) {
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    /**
     * Gets the requested data page as Page<T>
     * @param url The resource url
     * @param pageable The page request
     * @param filters The filters request
     * @param params Additional parameters
     */
    public getPaged<T>(url: string, pageable: Pageable, filters?: Filter[], params?: HttpParams): Observable<Page<T>> {
        params = HttpParamsBuilder.start(params)
            .appendPageable(pageable)
            .appendFilters(filters)
            .build();
        this.logger.debug('sending paged request @ ' + url, params);
        return this.http.get<Page<T>>(url, { params: params });
    }

    /**
     * Gets the requested data, supports dynamic filter options
     * @param url The request url
     * @param filters The filter options (will be translated to query params)
     * @param params Additional parameters
     */
    public getFiltered<T>(url: string, filters: Filter[], params?: HttpParams): Observable<T> {
        params = HttpParamsBuilder.start(params)
            .appendFilters(filters)
            .build();
        return this.http.get<T>(url, { params: params });
    }

    /***************************************************************************
     *                                                                         *
     * Private Methods                                                         *
     *                                                                         *
     **************************************************************************/



}
