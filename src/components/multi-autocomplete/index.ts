
import {NgModule} from '@angular/core';
import {MultiAutocompleteComponent} from './multi-autocomplete.component';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MdAutocompleteModule, MdInputModule} from '@angular/material';

export {MultiAutocompleteComponent} from './multi-autocomplete.component';
export * from './word-position'


@NgModule({
    imports: [
        CommonModule, MdInputModule, MdAutocompleteModule, FlexLayoutModule
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
