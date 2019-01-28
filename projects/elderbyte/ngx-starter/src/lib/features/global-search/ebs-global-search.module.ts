
import {ModuleWithProviders, NgModule} from '@angular/core';
import {EbsGlobalSearchComponent} from './ebs-global-search.component';
import {EbsGlobalSearchService} from './ebs-global-search.service';
import {MatButtonModule, MatIconModule, MatInputModule, MatMenuModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

export * from './ebs-global-search.component';
export * from './ebs-global-search.service';


@NgModule({
  declarations: [
    EbsGlobalSearchComponent
  ],
  exports : [
    EbsGlobalSearchComponent
  ],
  imports : [ CommonModule, MatIconModule, MatInputModule, MatButtonModule, MatMenuModule, FlexLayoutModule, TranslateModule ]
})
export class EbsGlobalSearchModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: EbsGlobalSearchModule,
      providers: [
        {
          provide: EbsGlobalSearchService,
          useClass: EbsGlobalSearchService
        },
      ]
    };
  }
}
