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
import {ElderToolbarModule} from '../navigation/toolbar/elder-toolbar.module';
import {RouterModule} from '@angular/router';
import {ElderToastModule} from '../toasts/elder-toast.module';
import {ElderShellNavigationToggleComponent} from './shell-navigation-toggle/elder-shell-navigation-toggle.component';

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


    ElderToolbarModule,
    ElderToastModule,

    FlexLayoutModule, TranslateModule

  ],
  declarations: [
    ElderShellComponent,
    ElderShellSideLeftDirective,
    ElderShellSideRightDirective,
    ElderShellCenterDirective,
    ElderShellNavigationToggleComponent
  ],
  exports: [
    ElderShellComponent,
    ElderShellSideLeftDirective,
    ElderShellSideRightDirective,
    ElderShellCenterDirective,
    ElderShellNavigationToggleComponent
  ]
})
export class ElderShellModule { }
