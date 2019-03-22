import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatBadgeModule,
  MatButtonModule,
  MatIconModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import {HttpDataTransferComponent} from './http-data-transfer/http-data-transfer.component';
import {HttpDataTransferAggregateComponent} from './http-data-transfer-aggregate/http-data-transfer-aggregate.component';
import {HttpDataTransferOverviewComponent} from './http-data-transfer-overview/http-data-transfer-overview.component';
import {HttpDataTransferIndicatorComponent} from './http-data-transfer-indicator/http-data-transfer-indicator.component';
import {ElderPipesModule} from '../../pipes/elder-pipes.module';

export {ElderDataTransferService} from './elder-data-transfer.service';
export {HttpDataTransferComponent} from './http-data-transfer/http-data-transfer.component';
export {HttpDataTransferAggregateComponent} from './http-data-transfer-aggregate/http-data-transfer-aggregate.component';
export {HttpDataTransferOverviewComponent} from './http-data-transfer-overview/http-data-transfer-overview.component';
export {HttpDataTransferIndicatorComponent} from './http-data-transfer-indicator/http-data-transfer-indicator.component';


@NgModule({
  imports: [
    CommonModule,

    MatIconModule, MatProgressBarModule,
    MatTooltipModule, MatToolbarModule,
    MatButtonModule, MatBadgeModule,
    MatProgressSpinnerModule,

    FlexLayoutModule, TranslateModule,

    ElderPipesModule
  ],
  declarations: [
    HttpDataTransferComponent,
    HttpDataTransferAggregateComponent,
    HttpDataTransferOverviewComponent,
    HttpDataTransferIndicatorComponent,
  ],
  exports: [
    HttpDataTransferComponent,
    HttpDataTransferAggregateComponent,
    HttpDataTransferOverviewComponent,
    HttpDataTransferIndicatorComponent
  ]
})
export class ElderDataTransferModule { }
