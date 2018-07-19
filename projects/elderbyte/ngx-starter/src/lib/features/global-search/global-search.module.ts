
import {ModuleWithProviders, NgModule} from '@angular/core';
import {GlobalSearchComponent} from './global-search.component';
import {GlobalSearchService} from './global-search.service';
import {MatButtonModule, MatIconModule, MatInputModule, MatMenuModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

export * from './global-search.component';
export * from './global-search.service';


@NgModule({
  declarations: [
    GlobalSearchComponent
  ],
  exports : [
    GlobalSearchComponent
  ],
  imports : [ CommonModule, MatIconModule, MatInputModule, MatButtonModule, MatMenuModule, FlexLayoutModule, TranslateModule ]
})
export class GlobalSearchModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GlobalSearchModule,
      providers: [
        {
          provide: GlobalSearchService,
          useClass: GlobalSearchService
        },
      ]
    };
  }
}
