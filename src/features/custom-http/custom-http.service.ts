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
export class CustomHttpService extends AuthHttp {


  static buildAuthConfig(authService: AuthenticationService): AuthConfig {
     return  new AuthConfig({
          tokenName: 'token',
          tokenGetter: () => {
              if (authService.isAuthenticated()) {
                  return authService.principal ? authService.principal.token : '';
              }
              return '';
          },
          noJwtError: false,
          globalHeaders: [{'Content-Type': 'application/json'}],
      });
  }

  constructor(backend: Http,
              options: RequestOptions,
              authService: AuthenticationService,
              private translate: TranslateService) {

    super(CustomHttpService.buildAuthConfig(authService), backend, options);
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  request(request: string|Request, options?: RequestOptionsArgs): Observable<Response> {
    if (request instanceof  Request) {
      return super.request(request as Request);
    }else {
      return super.request(request, this.handleOptions(options));
    }
  }


  get(url: string, options?: RequestOptionsArgs, pageable?: Pageable, filters?: Filter[]): Observable<Response> {
    return super.get(url, this.handleOptions(options, pageable, filters));
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return super.post(url, body, this.handleOptions(options));
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return super.put(url, body, this.handleOptions(options));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.delete(url, this.handleOptions(options));
  }

  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return super.patch(url, body, this.handleOptions(options));
  }

  head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.head(url, this.handleOptions(options));
  }

  options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.options(url, this.handleOptions(options));
  }



  /***************************************************************************
   *                                                                         *
   * Private Methods                                                         *
   *                                                                         *
   **************************************************************************/


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
