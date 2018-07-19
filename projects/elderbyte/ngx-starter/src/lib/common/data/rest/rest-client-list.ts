import {RestClient} from './rest-client';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Filter} from '../filter';
import {Sort} from '../sort';
import {Observable} from 'rxjs';
import {HttpParamsBuilder} from '../http-params-builder';

export class RestClientList<T, TID> extends RestClient<T, TID> {

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
        super(restEndpoint, http, idsParam)
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public findAllFiltered(filters?: Filter[], sorts?: Sort[]): Observable<T[]> {
        return this.findAll(
            HttpParamsBuilder.start()
                .appendFilters(filters)
                .appendSorts(sorts)
                .build()
        );
    }

    public findAll(params?: HttpParams): Observable<T[]> {
        return this.http.get<T[]>(this.restEndpoint, {
            params: params
        });
    }

}
