import { Http, Response, RequestOptionsArgs, RequestOptions, Request } from "@angular/http";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { AuthConfig, AuthHttp } from "angular2-jwt";
import { Pageable } from "../../common/data/page";
import { Filter } from "../../common/data/filter";
export declare class CustomHttpService extends AuthHttp {
    private translate;
    constructor(backend: Http, options: RequestOptions, authConfig: AuthConfig | null, translate: TranslateService);
    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/
    request(request: string | Request, options?: RequestOptionsArgs): Observable<Response>;
    get(url: string, options?: RequestOptionsArgs, pageable?: Pageable, filters?: Filter[]): Observable<Response>;
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>;
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>;
    delete(url: string, options?: RequestOptionsArgs): Observable<Response>;
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>;
    head(url: string, options?: RequestOptionsArgs): Observable<Response>;
    options(url: string, options?: RequestOptionsArgs): Observable<Response>;
    /***************************************************************************
     *                                                                         *
     * Private Methods                                                         *
     *                                                                         *
     **************************************************************************/
    private handleOptions(options?, pageable?, filters?);
    private addLocale(options);
    private addPageable(options, pageable);
    private addFilters(options, filters);
}
