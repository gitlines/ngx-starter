import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Page, Pageable, PageableUtil} from '../../common/data/page';
import {Filter, FilterUtil} from '../../common/data/filter';
import {NGXLogger} from 'ngx-logger';
import {HttpClient, HttpParams} from '@angular/common/http';



@Injectable()
export class HttpPagedClient {

    private static buildHttpParams(pageable: Pageable | null, filters?: Filter[], params?: HttpParams): HttpParams {

        if (!params) { params = new HttpParams(); }

        if (pageable) {
            params = PageableUtil.addPageQueryParams(params, pageable);
        }
        if (filters) {
            params = FilterUtil.addFilterQueryParams(params, filters);
        }
        return params;
    }

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    /**
     * Creates a new HttpPagedClient service
     */
    constructor(
        private logger: NGXLogger,
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
        params = HttpPagedClient.buildHttpParams(pageable, filters, params);
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
        params = HttpPagedClient.buildHttpParams(null, filters, params);
        return this.http.get<T>(url, { params: params });
    }

    /***************************************************************************
     *                                                                         *
     * Private Methods                                                         *
     *                                                                         *
     **************************************************************************/



}
