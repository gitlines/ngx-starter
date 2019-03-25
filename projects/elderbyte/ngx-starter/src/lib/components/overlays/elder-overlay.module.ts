import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElderOverlayComponent } from './elder-overlay.component';
import {OverlayModule} from '@angular/cdk/overlay';
import { ElderOverlayTriggerDirective } from './elder-overlay-trigger.directive';
import {ElderOverlayOriginDirective} from './elder-overlay-origin.directive';

export {ElderOverlayComponent} from './elder-overlay.component';
export {ElderOverlayTriggerDirective} from './elder-overlay-trigger.directive';
export {ElderOverlayOriginDirective} from './elder-overlay-origin.directive';

@NgModule({
  imports: [
    CommonModule,

    OverlayModule
  ],
  declarations: [
    ElderOverlayComponent,
    ElderOverlayTriggerDirective,
    ElderOverlayOriginDirective
  ],
  exports: [
    ElderOverlayComponent,
    ElderOverlayTriggerDirective,
    ElderOverlayOriginDirective
  ]
})
export class ElderOverlayModule { }
