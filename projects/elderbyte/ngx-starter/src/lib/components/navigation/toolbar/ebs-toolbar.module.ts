
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
    MatBadgeModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule
} from '@angular/material';
import {EbsToolbarComponent} from './ebs-toolbar/ebs-toolbar.component';

export {EbsToolbarComponent} from './ebs-toolbar/ebs-toolbar.component';

@NgModule({
    imports: [
        // common
        CommonModule, RouterModule,

        // layout
        FlexLayoutModule, MatDividerModule,

        // navigation
        MatToolbarModule,

        // buttons & indicators
        MatButtonModule, MatIconModule, MatBadgeModule,

        // translations
        TranslateModule
    ],
    declarations: [EbsToolbarComponent],
    exports: [EbsToolbarComponent]
})
export class EbsToolbarModule {}
