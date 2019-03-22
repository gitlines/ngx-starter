
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ElderExpandToggleButtonComponent} from './elder-expand-toggle-button.component';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

export {ElderExpandToggleButtonComponent} from './elder-expand-toggle-button.component';

@NgModule({
    imports: [
        CommonModule, MatButtonModule, MatIconModule, FlexLayoutModule
    ],
    declarations: [
        ElderExpandToggleButtonComponent
    ],
    exports : [
        ElderExpandToggleButtonComponent
    ]
})
export class ElderExpandToggleButtonModule {

}
