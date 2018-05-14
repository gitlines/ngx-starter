
import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {

    private _translate: TranslateService;

    constructor(
        private inj: Injector) {
    }


    private get translate(): TranslateService {
        if (!this._translate) {
            this._translate = this.inj.get(TranslateService); // Attempt to fix cyclic dependency
        }
        return this._translate;
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        /*
        TODO HttpRequest.clone is duplicating existing query params - disabling for now

        if (this.translate.currentLang) {
            req = req.clone({
                setParams: {
                    locale: this.translate.currentLang
                }
            });
        }
        */

        return next.handle(req);
    }
}
