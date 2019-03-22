import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ElderNavListComponent} from './nav-list/elder-nav-list.component';
import { ElderNavLinkComponent } from './nav-link/elder-nav-link.component';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {A11yModule} from '@angular/cdk/a11y';
import { ElderNavGroupComponent } from './nav-group/elder-nav-group.component';

export {ElderNavListComponent} from './nav-list/elder-nav-list.component';
export {ElderNavLinkComponent} from './nav-link/elder-nav-link.component';
export {ElderNavGroupComponent} from './nav-group/elder-nav-group.component';

@NgModule({
  declarations: [
    ElderNavListComponent,
    ElderNavLinkComponent,
    ElderNavGroupComponent
  ],
  exports: [
    ElderNavListComponent,
    ElderNavLinkComponent,
    ElderNavGroupComponent
  ],
  imports: [
    CommonModule, RouterModule,
    MatIconModule, MatButtonModule,
    A11yModule,

    TranslateModule, FlexLayoutModule
  ]
})
export class ElderNavModule { }
