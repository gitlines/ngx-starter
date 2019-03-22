import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EbsFileSelectComponent } from './file-select/file-select.component';
import {MatButtonModule, MatIconModule, MatListModule, MatProgressBarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ElderPipesModule} from '../../pipes/elder-pipes.module';
import { EbsFileUploadComponent } from './file-upload/file-upload.component';
import { FileSelectDirective } from './file-select.directive';
import {FileDropZoneDirective} from './file-drop-zone.directive';

export {EbsFileSelectComponent} from './file-select/file-select.component';
export {EbsFileUploadComponent} from './file-upload/file-upload.component';
export {FileSelectDirective} from './file-select.directive';
export {FileDropZoneDirective} from './file-drop-zone.directive';

@NgModule({
  imports: [
    CommonModule,

    FlexLayoutModule, MatListModule,

    MatButtonModule, MatIconModule,

    MatProgressBarModule,

    ElderPipesModule
  ],
  declarations: [
    EbsFileSelectComponent,
    EbsFileUploadComponent,
    FileSelectDirective,
    FileDropZoneDirective
  ],
  exports: [
    EbsFileSelectComponent,
    EbsFileUploadComponent,
    FileSelectDirective,
    FileDropZoneDirective
  ]
})
export class ElderFileModule { }
