
import {ModuleWithProviders, NgModule} from '@angular/core';
import {CustomHttpService} from './custom-http.service';
import {CommonModule} from '@angular/common';
import {JwtAuthModule} from '@elderbyte/ngx-jwt-auth';



export * from './custom-http.service'

/*
export interface CustomHttpConfig {
    tokenName?: string;
    noJwtError?: boolean;
    globalHeaders?: Array<Object>;
}*/

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
          useClass: CustomHttpService,
        },
      ]
    };
  }
}
