
import {ModuleWithProviders, NgModule} from '@angular/core';
import {ElderGlobalSearchComponent} from './elder-global-search.component';
import {ElderGlobalSearchService} from './elder-global-search.service';
import {MatButtonModule, MatIconModule, MatInputModule, MatMenuModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

export * from './elder-global-search.component';
export * from './elder-global-search.service';

/**
 * @deprecated This module is considered EOL
 */
@NgModule({
  declarations: [
    ElderGlobalSearchComponent
  ],
  exports : [
    ElderGlobalSearchComponent
  ],
  imports : [ CommonModule, MatIconModule, MatInputModule, MatButtonModule, MatMenuModule, FlexLayoutModule, TranslateModule ]
})
export class ElderGlobalSearchModule {
}
