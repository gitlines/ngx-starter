import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ElderSearchContextDirective} from './elder-search-context.directive';
import {ElderSearchInputDirective} from './elder-search-input.directive';
import {ElderSearchBoxComponent} from './search-box/elder-search-box.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {MatBadgeModule, MatButtonModule, MatIconModule, MatInputModule} from '@angular/material';
import {A11yModule} from '@angular/cdk/a11y';
import {TranslateModule} from '@ngx-translate/core';
import {ElderOverlayModule} from '../../overlays/elder-overlay.module';
import {ElderSearchPanelComponent} from './search-box/elder-search-panel.component';
import {ElderPanelModule} from '../../panels/elder-panel.module';


export {ElderSearchContextDirective} from './elder-search-context.directive';
export {ElderSearchInputDirective} from './elder-search-input.directive';
export {ElderSearchBoxComponent} from './search-box/elder-search-box.component';
export {ElderSearchPanelComponent} from './search-box/elder-search-panel.component';

@NgModule({
  imports: [
    CommonModule, FormsModule,

    MatInputModule, MatButtonModule, MatIconModule,
    MatBadgeModule,

    A11yModule,

    ElderOverlayModule,
    ElderPanelModule,

    FlexLayoutModule, TranslateModule
  ],
  declarations: [
    ElderSearchContextDirective, ElderSearchInputDirective,
    ElderSearchBoxComponent, ElderSearchPanelComponent
  ],
  exports: [
    ElderSearchContextDirective, ElderSearchInputDirective,
    ElderSearchBoxComponent, ElderSearchPanelComponent
  ],
})
export class ElderSearchModule { }
