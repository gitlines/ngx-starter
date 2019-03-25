
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCommonModule} from '@angular/material';
import {ElderPanelComponent} from './flat/elder-panel.component';
import { ElderCardPanelComponent } from './card-panel/elder-card-panel.component';
import {FlexLayoutModule} from '@angular/flex-layout';

export {ElderPanelComponent} from './flat/elder-panel.component';
export {ElderCardPanelComponent} from './card-panel/elder-card-panel.component';

@NgModule({
  imports : [
    CommonModule, MatCommonModule,

    FlexLayoutModule
  ],
  declarations: [
    ElderPanelComponent,
    ElderCardPanelComponent
  ],
  exports : [
    ElderPanelComponent,
    ElderCardPanelComponent
  ]
})
export class ElderPanelModule { }
