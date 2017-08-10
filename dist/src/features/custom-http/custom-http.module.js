import { NgModule } from "@angular/core";
import { CustomHttpService } from "./custom-http.service";
import { CommonModule } from "@angular/common";
import { AuthenticationService, JwtAuthModule } from "@elderbyte/ngx-jwt-auth";
import { TranslateService } from "@ngx-translate/core";
import { Http, RequestOptions } from "@angular/http";
import { AuthConfig } from "angular2-jwt";
export * from "./custom-http.service";
var CustomHttpModule = (function () {
    function CustomHttpModule() {
    }
    CustomHttpModule.forRoot = function () {
        return {
            ngModule: CustomHttpModule,
            providers: [
                {
                    provide: CustomHttpService,
                    useFactory: createCustomHttpService,
                    deps: [Http, RequestOptions, TranslateService, AuthenticationService]
                },
            ]
        };
    };
    CustomHttpModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, JwtAuthModule]
                },] },
    ];
    /** @nocollapse */
    CustomHttpModule.ctorParameters = function () { return []; };
    return CustomHttpModule;
}());
export { CustomHttpModule };
//Because of AOT Compiler
export function createCustomHttpService(backend, options, translate, authService) {
    var tokenGetterFn = function () {
        if (authService.isAuthenticated()) {
            return authService.principal ? authService.principal.token : '';
        }
        return '';
    };
    return new CustomHttpService(backend, options, new AuthConfig({
        tokenName: 'token',
        tokenGetter: tokenGetterFn,
        noJwtError: false,
        globalHeaders: [{ 'Content-Type': 'application/json' }],
    }), translate);
}
//# sourceMappingURL=custom-http.module.js.map