
import {ModuleWithProviders, NgModule} from "@angular/core";
import {CustomHttpService} from "./custom-http.service";
import {CommonModule} from "@angular/common";
import {AuthenticationService, JwtAuthModule} from "@elderbyte/ngx-jwt-auth";
import {TranslateService} from "@ngx-translate/core";
import {Http, RequestOptions} from "@angular/http";
import {AuthConfig} from "angular2-jwt";


export * from "./custom-http.service"


@NgModule({
  imports : [ CommonModule, JwtAuthModule ]
})
export class CustomHttpModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CustomHttpModule,
      providers: [
        {
          provide: CustomHttpService,
          useFactory: createCustomHttpService,
          deps: [Http, RequestOptions, TranslateService, AuthenticationService]
        },
      ]
    }
  }
}


//Because of AOT Compiler
export function createCustomHttpService(
    backend: Http,
    options: RequestOptions,
    translate: TranslateService,
    authService : AuthenticationService) {

    let tokenGetterFn = () => {
        if(authService.isAuthenticated()){
            return authService.principal ? authService.principal.token : '';
        }
        return '';
    };

    return new CustomHttpService(
        backend,
        options,
        new AuthConfig({
            tokenName: 'token',
            tokenGetter: tokenGetterFn,
            noJwtError: false,
            globalHeaders: [{'Content-Type':'application/json'}],
        }),
        translate
    );
}