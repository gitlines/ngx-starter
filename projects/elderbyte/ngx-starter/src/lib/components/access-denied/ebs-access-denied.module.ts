
import {NgModule} from '@angular/core';
import {EbsAccessDeniedComponent} from './ebs-access-denied.component';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule, MatIconModule} from '@angular/material';

export { EbsAccessDeniedComponent } from './ebs-access-denied.component';

@NgModule({
    declarations: [
        EbsAccessDeniedComponent
    ],
    exports : [
        EbsAccessDeniedComponent
    ],
    imports : [
        CommonModule,

        MatIconModule, MatCardModule,

        FlexLayoutModule
    ]
})
export class EbsAccessDeniedModule { }
