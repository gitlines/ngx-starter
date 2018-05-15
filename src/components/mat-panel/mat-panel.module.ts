
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCommonModule} from '@angular/material';
import {MatPanelComponent} from './mat-panel.component';

@NgModule({
    declarations: [
        MatPanelComponent
    ],
    exports : [
        MatPanelComponent
    ],
    imports : [
        CommonModule, MatCommonModule
    ]
})
export class MatPanelModule { }
