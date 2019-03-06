import {Injectable, InjectionToken, Injector} from '@angular/core';
import {HttpBackend, HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientBuilder {

  constructor() { }

  // TODO Custom HttpClient builder with default headers
}

/*

export const HTTP_INTERCEPTORS_CUSTOM = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS_CUSTOM');

export class HttpClientCustom extends HttpClient {

  constructor(backend: HttpBackend, injector: Injector) {
    super(new MyHandlerService(backend, injector, HTTP_INTERCEPTORS_CUSTOM));
  }
}

export class MyHttpInterceptorHandler implements HttpHandler {
  constructor(
    private next: HttpHandler,
    private interceptor: HttpInterceptor) { }

  public handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.interceptor.intercept(req, this.next);
  }
}

export class MyHandlerService implements HttpHandler {

  private chain: HttpHandler | null = null;

  constructor(
    private backend: HttpBackend,
    private injector: Injector,
    private interceptors: InjectionToken<HttpInterceptor[]>) {
  }

  public handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    if (this.chain === null) {
      const interceptors = this.injector.get(this.interceptors, []);
      this.chain = interceptors.reduceRight(
        (next, interceptor) => new MyHttpInterceptorHandler(next, interceptor), this.backend);
    }
    return this.chain.handle(req);
  }
}
*/
