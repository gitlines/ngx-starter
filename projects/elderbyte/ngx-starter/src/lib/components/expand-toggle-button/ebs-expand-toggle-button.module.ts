
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EbsExpandToggleButtonComponent} from './ebs-expand-toggle-button.component';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

export {EbsExpandToggleButtonComponent} from './ebs-expand-toggle-button.component';

@NgModule({
    imports: [
        CommonModule, MatButtonModule, MatIconModule, FlexLayoutModule
    ],
    declarations: [
        EbsExpandToggleButtonComponent
    ],
    exports : [
        EbsExpandToggleButtonComponent
    ]
})
export class EbsExpandToggleButtonModule {

}
