import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LabelEditorComponent} from './labels-input/labels-input.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatIconModule, MatInputModule, MatChipsModule, MatAutocompleteModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

export * from './label-suggestion-provider';
export {LabelEditorComponent} from './labels-input/labels-input.component'

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule, MatInputModule, MatChipsModule, MatAutocompleteModule
  ],
  declarations: [LabelEditorComponent],
  exports: [LabelEditorComponent]
})
export class LabelsModule { }
