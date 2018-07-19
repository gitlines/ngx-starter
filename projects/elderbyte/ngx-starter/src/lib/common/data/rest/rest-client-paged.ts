import {HttpClient, HttpParams} from '@angular/common/http';
import {Filter} from '../filter';
import {Observable} from 'rxjs';
import {Page, Pageable} from '../page';
import {RestClient} from './rest-client';
import {HttpParamsBuilder} from '../http-params-builder';
import {LoggerFactory} from '@elderbyte/ts-logger';

export class RestClientPaged<T, TID> extends RestClient<T, TID> {

    private readonly logger = LoggerFactory.getLogger('RestClientPaged');

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        restEndpoint: string,
        http: HttpClient,
        idsParam = 'ids'
    ) {
        super(restEndpoint, http, idsParam);
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public findAllPaged(pageable: Pageable, filters?: Filter[], params?: HttpParams): Observable<Page<T>> {
        return this.getPaged(this.restEndpoint, pageable, filters, params);
    };

    /***************************************************************************
     *                                                                         *
     * Private methods                                                         *
     *                                                                         *
     **************************************************************************/


    /**
     * Gets the requested data page as Page<T>
     * @param url The resource url
     * @param pageable The page request
     * @param filters The filters request
     * @param params Additional parameters
     */
    private getPaged(url: string, pageable: Pageable, filters?: Filter[], params?: HttpParams): Observable<Page<T>> {
        params = HttpParamsBuilder.start(params)
            .appendPageable(pageable)
            .appendFilters(filters)
            .build();
        return this.http.get<Page<T>>(url, { params: params });
    }

}
