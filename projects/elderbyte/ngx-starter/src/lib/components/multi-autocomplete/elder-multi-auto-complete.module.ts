
import {NgModule} from '@angular/core';
import {ElderMultiAutocompleteComponent} from './elder-multi-autocomplete.component';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatAutocompleteModule, MatInputModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';

export {ElderMultiAutocompleteComponent} from './elder-multi-autocomplete.component';
export * from './word-position';


@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule, MatInputModule, MatAutocompleteModule, FlexLayoutModule
    ],
    declarations: [
        ElderMultiAutocompleteComponent
    ],
    exports : [
        ElderMultiAutocompleteComponent
    ]
})
export class ElderMultiAutoCompleteModule {

}
