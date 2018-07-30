import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSelectComponent } from './file-select/file-select.component';
import {MatButtonModule, MatIconModule, MatListModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonPipesModule} from '../../pipes/common-pipes.module';

@NgModule({
  imports: [
    CommonModule,

    FlexLayoutModule, MatListModule,

    MatButtonModule, MatIconModule,

    CommonPipesModule
  ],
  declarations: [FileSelectComponent],
  exports: [FileSelectComponent]
})
export class FileUploadModule { }
