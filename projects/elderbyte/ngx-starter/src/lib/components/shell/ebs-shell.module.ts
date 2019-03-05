import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EbsShellCenterDirective,
  EbsShellComponent,
  EbsShellSideLeftDirective,
  EbsShellSideRightDirective
} from './shell/ebs-shell.component';
import {MatButtonModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import {EbsToolbarModule} from '../navigation/toolbar/ebs-toolbar.module';
import {EbsSideContentModule} from '../../features/side-content/ebs-side-content.module';
import {RouterModule} from '@angular/router';
import {EbsToastModule} from '../../features/toasts/ebs-toast.module';

export {EbsShellComponent} from './shell/ebs-shell.component';

export {DrawerOutletBinding} from './drawers/drawer-outlet-binding';
export {RouteOutletDrawerService} from './drawers/route-outlet-drawer.service';
export {RouterOutletService} from './drawers/router-outlet.service';

@NgModule({
  imports: [
    CommonModule,

    RouterModule,

    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,


    EbsToolbarModule,
    EbsSideContentModule,
    EbsToastModule,

    FlexLayoutModule, TranslateModule

  ],
  declarations: [EbsShellComponent, EbsShellSideLeftDirective, EbsShellSideRightDirective, EbsShellCenterDirective],
  exports: [EbsShellComponent, EbsShellSideLeftDirective, EbsShellSideRightDirective, EbsShellCenterDirective]
})
export class EbsShellModule { }
