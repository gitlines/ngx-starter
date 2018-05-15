
import {NgModule} from '@angular/core';
import {AccessDeniedComponent} from './access-denied.component';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule, MatIconModule} from '@angular/material';

export { AccessDeniedComponent } from './access-denied.component'

@NgModule({
    declarations: [
        AccessDeniedComponent
    ],
    exports : [
        AccessDeniedComponent
    ],
    imports : [
        CommonModule,

        MatIconModule, MatCardModule,

        FlexLayoutModule
    ]
})
export class AccessDeniedModule { }
