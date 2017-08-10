import { ModuleWithProviders } from "@angular/core";
import { CustomHttpService } from "./custom-http.service";
import { AuthenticationService } from "@elderbyte/ngx-jwt-auth";
import { TranslateService } from "@ngx-translate/core";
import { Http, RequestOptions } from "@angular/http";
export * from "./custom-http.service";
export declare class CustomHttpModule {
    static forRoot(): ModuleWithProviders;
}
export declare function createCustomHttpService(backend: Http, options: RequestOptions, translate: TranslateService, authService: AuthenticationService): CustomHttpService;
