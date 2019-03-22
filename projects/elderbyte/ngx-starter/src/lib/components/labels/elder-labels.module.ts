import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ElderLabelInputComponent} from './labels-input/labels-input.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatIconModule, MatInputModule, MatChipsModule, MatAutocompleteModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

export {ElderLabelInputComponent} from './labels-input/labels-input.component';

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,

        MatIconModule, MatInputModule, MatChipsModule, MatAutocompleteModule,
        FlexLayoutModule
    ],
    declarations: [ElderLabelInputComponent],
    exports: [ElderLabelInputComponent]
})
export class ElderLabelsModule { }
