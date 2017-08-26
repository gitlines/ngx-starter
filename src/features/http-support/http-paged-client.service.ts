import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Page, Pageable, PageableUtil} from '../../common/data/page';
import {Filter, FilterUtil} from '../../common/data/filter';
import {HttpClient, HttpParams} from '@angular/common/http';



@Injectable()
export class HttpPagedClient {

    private static buildHttpParams(pageable?: Pageable, filters?: Filter[], params?: HttpParams): HttpParams {

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
     * @param {HttpClient} http
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
     * @param {string} url The resource url
     * @param {Pageable} pageable The page request
     * @param {Filter[]} filters The filters request
     * @param {HttpParams} params Additional parameters
     * @returns {Observable<T>}
     */
    public getPaged<T>(url: string, pageable: Pageable, filters?: Filter[], params?: HttpParams): Observable<Page<T>> {
        params = HttpPagedClient.buildHttpParams(pageable, filters, params);
        console.log('sending paged request @ ' + url, params);
        return this.http.get<Page<T>>(url, { params: params });
    }

    /**
     * Gets the requested data, supports dynamic filter options
     * @param {string} url The request url
     * @param {Filter[]} filters The filter options (will be translated to query params)
     * @param {HttpParams} params Additional parameters
     * @returns {Observable<T>}
     */
    public getFiltered<T>(url: string, filters?: Filter[], params?: HttpParams): Observable<T> {
        params = HttpPagedClient.buildHttpParams(null, filters, params);
        return this.http.get<T>(url, { params: params });
    }

    /***************************************************************************
     *                                                                         *
     * Private Methods                                                         *
     *                                                                         *
     **************************************************************************/



}
