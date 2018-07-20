
import {NgModule} from '@angular/core';
import {MultiAutocompleteComponent} from './multi-autocomplete.component';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatAutocompleteModule, MatInputModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';

export {MultiAutocompleteComponent} from './multi-autocomplete.component';
export * from './word-position';


@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule, MatInputModule, MatAutocompleteModule, FlexLayoutModule
    ],
    declarations: [
        MultiAutocompleteComponent
    ],
    exports : [
        MultiAutocompleteComponent
    ]
})
export class MultiAutoCompleteModule {

}
