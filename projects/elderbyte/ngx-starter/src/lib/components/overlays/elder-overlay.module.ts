import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElderOverlayComponent } from './elder-overlay.component';
import {OverlayModule} from '@angular/cdk/overlay';
import { ElderOverlayTriggerDirective } from './elder-overlay-trigger.directive';

export {ElderOverlayComponent} from './elder-overlay.component';
export {ElderOverlayTriggerDirective} from './elder-overlay-trigger.directive';

@NgModule({
  imports: [
    CommonModule,

    OverlayModule
  ],
  declarations: [
    ElderOverlayComponent,
    ElderOverlayTriggerDirective
  ],
  exports: [
    ElderOverlayComponent,
    ElderOverlayTriggerDirective
  ]
})
export class ElderOverlayModule { }
