
import {RestClient} from './rest-client';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TokenChunkRequest} from '../data-context';
import {Observable} from 'rxjs/internal/Observable';
import {ContinuableListing} from '../continuable-listing';
import {HttpParamsBuilder} from '../http-params-builder';


export class RestClientContinuable<T, TID> extends RestClient<T, TID> {

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

    public findAllContinuable(request: TokenChunkRequest, params?: HttpParams): Observable<ContinuableListing<T>> {

        return this.http.get<ContinuableListing<T>>(this.restEndpoint,
            {
                params: HttpParamsBuilder.start(params)
                    .appendContinuationRequest(request)
                    .build()
            }
        );
    };

}
