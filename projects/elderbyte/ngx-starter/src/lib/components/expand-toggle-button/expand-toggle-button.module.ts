
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExpandToggleButtonComponent} from './expand-toggle-button.component';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

export {ExpandToggleButtonComponent} from './expand-toggle-button.component';

@NgModule({
    imports: [
        CommonModule, MatButtonModule, MatIconModule, FlexLayoutModule
    ],
    declarations: [
        ExpandToggleButtonComponent
    ],
    exports : [
        ExpandToggleButtonComponent
    ]
})
export class ExpandToggleButtonModule {

}
