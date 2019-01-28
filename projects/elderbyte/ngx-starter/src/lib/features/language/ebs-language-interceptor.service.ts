
import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';

/**
 * This interceptor injects the current locale
 * so the backend know what the current desired locale is of a request.
 */
@Injectable()
export class EbsLanguageInterceptor implements HttpInterceptor {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private _translate: TranslateService;

  /***************************************************************************
   *                                                                         *
   * Constructors                                                            *
   *                                                                         *
   **************************************************************************/

  constructor(
    private inj: Injector) {
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.translate.currentLang) {

      // Keeps the original request params. as a new HttpParams
      let newParams = new HttpParams({fromString: req.params.toString()});

      newParams = newParams.set('locale', this.translate.currentLang);

      // Clone the request with params instead of setParams
      // Workaround for https://github.com/angular/angular/issues/18812
      const requestClone = req.clone({
        params: newParams
      });

      return next.handle(requestClone);
    }

    return next.handle(req);
  }

  /***************************************************************************
   *                                                                         *
   * Private Methods                                                         *
   *                                                                         *
   **************************************************************************/

  private get translate(): TranslateService {
    if (!this._translate) {
      this._translate = this.inj.get(TranslateService); // Workaround for cyclic dependency
    }
    return this._translate;
  }
}
