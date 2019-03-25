import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatIconModule, MatTooltipModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import {ElderOfflineIndicatorComponent} from './offline-indicator/elder-offline-indicator.component';
import {ElderPipesModule} from '../../pipes/elder-pipes.module';

@NgModule({
  imports: [

    // Angular
    CommonModule,

    // Third Party
    FlexLayoutModule, TranslateModule,

    // Angular Material
    MatIconModule, MatTooltipModule,
    MatButtonModule,

    // ElderByte
    ElderPipesModule

  ],
  declarations: [
    ElderOfflineIndicatorComponent
  ],
  exports: [
    ElderOfflineIndicatorComponent
  ]
})
export class ElderConnectivityModule { }
