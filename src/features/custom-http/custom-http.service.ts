import {Injectable} from '@angular/core';
import {
    Http, Response, RequestOptionsArgs, RequestOptions, Request, URLSearchParams,
} from '@angular/http';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {AuthConfig, AuthHttp} from 'angular2-jwt';
import {Pageable, PageableUtil} from '../../common/data/page';
import {Filter, FilterUtil} from '../../common/data/filter';
import {AuthenticationService} from '@elderbyte/ngx-jwt-auth';


@Injectable()
export class CustomHttpService {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private _authHttp: AuthHttp;


    /**
     * Creates a new CustomHttpService service
     * @param {Http} backend
     * @param {RequestOptions} requestOptions
     * @param {AuthenticationService} authService
     * @param {TranslateService} translate
     */
    constructor(private backend: Http,
                private requestOptions: RequestOptions,
                private authService: AuthenticationService,
                private translate: TranslateService) {
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    request(request: string|Request, options?: RequestOptionsArgs): Observable<Response> {
        if (request instanceof  Request) {
            return this.authHttp.request(request as Request);
        }else {
            return this.authHttp.request(request, this.handleOptions(options));
        }
    }


    get(url: string, options?: RequestOptionsArgs, pageable?: Pageable, filters?: Filter[]): Observable<Response> {
        return this.authHttp.get(url, this.handleOptions(options, pageable, filters));
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.authHttp.post(url, body, this.handleOptions(options));
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.authHttp.put(url, body, this.handleOptions(options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.authHttp.delete(url, this.handleOptions(options));
    }

    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.authHttp.patch(url, body, this.handleOptions(options));
    }

    head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.authHttp.head(url, this.handleOptions(options));
    }

    options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.authHttp.options(url, this.handleOptions(options));
    }



    /***************************************************************************
     *                                                                         *
     * Private Methods                                                         *
     *                                                                         *
     **************************************************************************/

    private get authHttp(): AuthHttp {
        if (!this._authHttp) {
            this._authHttp = this.buildAuthHttp();
        }
        return this._authHttp;
    }

    private buildAuthHttp(): AuthHttp {
        let config = new AuthConfig({
            tokenName: 'token',
            tokenGetter: () => {
                if (this.authService.isAuthenticated()) {
                    return this.authService.principal ? this.authService.principal.token : '';
                }
                return '';
            },
            noJwtError: false,
            globalHeaders: [{'Content-Type': 'application/json'}],
        });
        return new AuthHttp(config, this.backend, this.requestOptions);
    }

    private handleOptions(options?: RequestOptionsArgs, pageable?: Pageable, filters?: Filter[]): RequestOptionsArgs {

        if (!options) {
            options = {} as RequestOptionsArgs;
        }
        if (pageable) {
            options = this.addPageable(options, pageable);
        }
        if (filters) {
            options = this.addFilters(options, filters);
        }

        options =  this.addLocale(options);

        // console.log('injected options: ', options);

        return options;
    }


    private addLocale(options: RequestOptionsArgs): RequestOptionsArgs {
        let params: URLSearchParams;

        if (options.params) {
            params = <URLSearchParams> options.params;
        } else {
            params = new URLSearchParams();
        }

        params.set('locale', this.translate.currentLang);
        options.params = params;

        return options;
    }

    private addPageable(options: RequestOptionsArgs, pageable: Pageable): RequestOptionsArgs {
        let params: URLSearchParams;

        if (options.params) {
            params = <URLSearchParams> options.params;
        } else {
            params = new URLSearchParams();
        }
        options.params = PageableUtil.addSearchParams(params, pageable);
        return options;
    }

    private addFilters(options: RequestOptionsArgs, filters: Filter[]): RequestOptionsArgs {
        let params: URLSearchParams;

        if (options.params) {
            params = <URLSearchParams> options.params;
        } else {
            params = new URLSearchParams();
        }
        options.params = FilterUtil.addSearchParams(params, filters);
        return options;
    }

}
