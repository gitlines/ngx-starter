
import {NgModule} from '@angular/core';
import {ElderAccessDeniedComponent} from './elder-access-denied.component';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule, MatIconModule} from '@angular/material';

export { ElderAccessDeniedComponent } from './elder-access-denied.component';

@NgModule({
    declarations: [
        ElderAccessDeniedComponent
    ],
    exports : [
        ElderAccessDeniedComponent
    ],
    imports : [
        CommonModule,

        MatIconModule, MatCardModule,

        FlexLayoutModule
    ]
})
export class ElderAccessDeniedModule { }
