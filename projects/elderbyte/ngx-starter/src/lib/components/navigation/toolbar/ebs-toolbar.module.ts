
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
import {EbsLanguageModule} from '../../../features/language/ebs-language.module';
import { EbsToolbarColumnDirective } from './ebs-toolbar-column.directive';
import {EbsToolbarTitleComponent} from './ebs-toolbar-title/ebs-toolbar-title.component';

export {EbsToolbarService} from './ebs-toolbar.service';
export {EbsToolbarColumnDirective} from './ebs-toolbar-column.directive';
export {EbsToolbarComponent} from './ebs-toolbar/ebs-toolbar.component';

export {EbsToolbarTitleComponent} from './ebs-toolbar-title/ebs-toolbar-title.component';
export {EbsToolbarTitleService} from './ebs-toolbar-title/ebs-toolbar-title.service';

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
        TranslateModule, EbsLanguageModule
    ],
    declarations: [
      EbsToolbarComponent,
      EbsToolbarColumnDirective,
      EbsToolbarTitleComponent
    ],
    exports: [
      EbsToolbarComponent,
      EbsToolbarColumnDirective,
      EbsToolbarTitleComponent
    ]
})
export class EbsToolbarModule {}
