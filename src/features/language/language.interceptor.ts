
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {

    constructor(private translate: TranslateService) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        if (this.translate.currentLang) {
            req = req.clone({
                setParams: {
                    locale: this.translate.currentLang
                }
            });
        }
        return next.handle(req);
    }
}
