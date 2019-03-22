import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ElderShellCenterDirective,
  ElderShellComponent,
  ElderShellSideLeftDirective,
  ElderShellSideRightDirective
} from './shell/elder-shell.component';
import {MatButtonModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import {EbsToolbarModule} from '../navigation/toolbar/ebs-toolbar.module';
import {EbsSideContentModule} from '../../features/side-content/ebs-side-content.module';
import {RouterModule} from '@angular/router';
import {ElderToastModule} from '../../features/toasts/elder-toast.module';

export {ElderShellComponent} from './shell/elder-shell.component';

export {DrawerOutletBinding} from './drawers/drawer-outlet-binding';
export {ElderRouteOutletDrawerService} from './drawers/elder-route-outlet-drawer.service';
export {ElderRouterOutletService} from './drawers/elder-router-outlet.service';

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
    ElderToastModule,

    FlexLayoutModule, TranslateModule

  ],
  declarations: [ElderShellComponent, ElderShellSideLeftDirective, ElderShellSideRightDirective, ElderShellCenterDirective],
  exports: [ElderShellComponent, ElderShellSideLeftDirective, ElderShellSideRightDirective, ElderShellCenterDirective]
})
export class ElderShellModule { }
