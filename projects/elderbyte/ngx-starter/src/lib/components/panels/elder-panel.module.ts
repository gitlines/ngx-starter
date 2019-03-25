
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCommonModule} from '@angular/material';
import {ElderPanelComponent} from './flat/elder-panel.component';

export {ElderPanelComponent} from './flat/elder-panel.component';

@NgModule({
    declarations: [
        ElderPanelComponent
    ],
    exports : [
        ElderPanelComponent
    ],
    imports : [
        CommonModule, MatCommonModule
    ]
})
export class ElderPanelModule { }
