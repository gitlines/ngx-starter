import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElderFileSelectComponent } from './file-select/file-select.component';
import {MatButtonModule, MatIconModule, MatListModule, MatProgressBarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ElderPipesModule} from '../../pipes/elder-pipes.module';
import { ElderFileUploadComponent } from './file-upload/file-upload.component';
import { ElderFileSelectDirective } from './elder-file-select.directive';
import {ElderFileDropZoneDirective} from './elder-file-drop-zone.directive';

export {ElderFileSelectComponent} from './file-select/file-select.component';
export {ElderFileUploadComponent} from './file-upload/file-upload.component';
export {ElderFileSelectDirective} from './elder-file-select.directive';
export {ElderFileDropZoneDirective} from './elder-file-drop-zone.directive';

@NgModule({
  imports: [
    CommonModule,

    FlexLayoutModule, MatListModule,

    MatButtonModule, MatIconModule,

    MatProgressBarModule,

    ElderPipesModule
  ],
  declarations: [
    ElderFileSelectComponent,
    ElderFileUploadComponent,
    ElderFileSelectDirective,
    ElderFileDropZoneDirective
  ],
  exports: [
    ElderFileSelectComponent,
    ElderFileUploadComponent,
    ElderFileSelectDirective,
    ElderFileDropZoneDirective
  ]
})
export class ElderFileModule { }
