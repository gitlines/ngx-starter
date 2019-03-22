
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
import {ElderToolbarComponent} from './ebs-toolbar/elder-toolbar.component';
import {ElderLanguageModule} from '../../../features/language/elder-language.module';
import { ElderToolbarColumnDirective } from './elder-toolbar-column.directive';
import {ElderToolbarTitleComponent} from './ebs-toolbar-title/elder-toolbar-title.component';

export {ElderToolbarService} from './elder-toolbar.service';
export {ElderToolbarColumnDirective} from './elder-toolbar-column.directive';
export {ElderToolbarComponent} from './ebs-toolbar/elder-toolbar.component';

export {ElderToolbarTitleComponent} from './ebs-toolbar-title/elder-toolbar-title.component';
export {ElderToolbarTitleService, ToolbarHeader} from './ebs-toolbar-title/elder-toolbar-title.service';

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
        TranslateModule, ElderLanguageModule
    ],
    declarations: [
      ElderToolbarComponent,
      ElderToolbarColumnDirective,
      ElderToolbarTitleComponent
    ],
    exports: [
      ElderToolbarComponent,
      ElderToolbarColumnDirective,
      ElderToolbarTitleComponent
    ]
})
export class ElderToolbarModule {}
