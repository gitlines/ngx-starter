
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
import {LanguageModule} from '../../../features/language/language.module';
import { EbsToolbarColumnDirective } from './ebs-toolbar-column.directive';
import {ToolbarModule} from '../../../features/toolbar/toolbar.module';

export {EbsToolbarService} from './ebs-toolbar.service';
export {EbsToolbarColumnDirective} from './ebs-toolbar-column.directive';
export {EbsToolbarComponent} from './ebs-toolbar/ebs-toolbar.component';

@NgModule({
    imports: [
        // common
        CommonModule, RouterModule,

        // layout
        FlexLayoutModule, MatDividerModule,

        // navigation
        MatToolbarModule, ToolbarModule,

        // buttons & indicators
        MatButtonModule, MatIconModule, MatBadgeModule,

        // translations
        TranslateModule, LanguageModule
    ],
    declarations: [EbsToolbarComponent, EbsToolbarColumnDirective],
    exports: [EbsToolbarComponent, EbsToolbarColumnDirective]
})
export class EbsToolbarModule {}
