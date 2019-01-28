
import {NgModule} from '@angular/core';
import {EbsMultiAutocompleteComponent} from './ebs-multi-autocomplete.component';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatAutocompleteModule, MatInputModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';

export {EbsMultiAutocompleteComponent} from './ebs-multi-autocomplete.component';
export * from './word-position';


@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule, MatInputModule, MatAutocompleteModule, FlexLayoutModule
    ],
    declarations: [
        EbsMultiAutocompleteComponent
    ],
    exports : [
        EbsMultiAutocompleteComponent
    ]
})
export class EbsMultiAutoCompleteModule {

}
