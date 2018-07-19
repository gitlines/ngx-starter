
import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpPagedClient} from './http-paged-client.service';

export * from './http-paged-client.service';

@NgModule({
  imports : [ CommonModule ]
})
export class HttpSupportModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HttpSupportModule,
      providers: [
          HttpPagedClient
      ]
    };
  }
}
