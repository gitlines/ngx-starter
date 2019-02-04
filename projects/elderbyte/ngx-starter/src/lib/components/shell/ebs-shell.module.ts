import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EbsShellComponent, EbsShellSideLeftDirective, EbsShellSideRightDirective} from './shell/ebs-shell.component';
import {MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import {EbsToolbarModule} from '../navigation/toolbar/ebs-toolbar.module';
import {EbsSideContentModule} from '../../features/side-content/ebs-side-content.module';
import {RouterModule} from '@angular/router';
import {EbsToastModule} from '../../features/toasts/ebs-toast.module';

export {EbsShellComponent} from './shell/ebs-shell.component';

@NgModule({
  imports: [
    CommonModule,

    RouterModule,

    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,


    EbsToolbarModule,
    EbsSideContentModule,
    EbsToastModule,

    FlexLayoutModule, TranslateModule

  ],
  declarations: [EbsShellComponent, EbsShellSideLeftDirective, EbsShellSideRightDirective],
  exports: [EbsShellComponent, EbsShellSideLeftDirective, EbsShellSideRightDirective]
})
export class EbsShellModule { }
