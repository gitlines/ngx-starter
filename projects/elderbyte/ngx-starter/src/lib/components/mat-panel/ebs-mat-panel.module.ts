
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCommonModule} from '@angular/material';
import {EbsMatPanelComponent} from './ebs-mat-panel.component';

export {EbsMatPanelComponent} from './ebs-mat-panel.component';

@NgModule({
    declarations: [
        EbsMatPanelComponent
    ],
    exports : [
        EbsMatPanelComponent
    ],
    imports : [
        CommonModule, MatCommonModule
    ]
})
export class EbsMatPanelModule { }
