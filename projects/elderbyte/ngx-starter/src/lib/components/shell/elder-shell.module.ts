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
import {RouterModule} from '@angular/router';
import {ElderToastModule} from '../../features/toasts/elder-toast.module';
import {ShellNavigationToggleComponent} from './shell-navigation-toggle/shell-navigation-toggle.component';

export * from './shell/elder-shell.component';
export {DrawerOutletBinding} from './drawers/drawer-outlet-binding';
export {ElderRouteOutletDrawerService} from './drawers/elder-route-outlet-drawer.service';
export {ElderRouterOutletService} from './drawers/elder-router-outlet.service';
export {ElderShellService} from './elder-shell.service';

@NgModule({
  imports: [
    CommonModule, RouterModule,

    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,


    EbsToolbarModule,
    ElderToastModule,

    FlexLayoutModule, TranslateModule

  ],
  declarations: [
    ElderShellComponent,
    ElderShellSideLeftDirective,
    ElderShellSideRightDirective,
    ElderShellCenterDirective,
    ShellNavigationToggleComponent
  ],
  exports: [
    ElderShellComponent,
    ElderShellSideLeftDirective,
    ElderShellSideRightDirective,
    ElderShellCenterDirective,
    ShellNavigationToggleComponent
  ]
})
export class ElderShellModule { }
