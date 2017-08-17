
import {ModuleWithProviders, NgModule} from '@angular/core';
import {HttpPagedClient} from './custom-http.service';
import {CommonModule} from '@angular/common';
import {LanguageInterceptor} from './language.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

export * from './custom-http.service'
export * from './language.interceptor'


@NgModule({
  imports : [ CommonModule ]
})
export class CustomHttpModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CustomHttpModule,
      providers: [
          HttpPagedClient,
          { provide: HTTP_INTERCEPTORS, useClass: LanguageInterceptor, multi: true }
      ]
    };
  }
}
