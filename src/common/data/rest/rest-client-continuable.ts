
import {RestClient} from './rest-client';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ContinuableListing} from '../continuable-listing';
import {HttpParamsBuilder} from '../http-params-builder';
import {TokenChunkRequest} from '../token-chunk-request';


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
