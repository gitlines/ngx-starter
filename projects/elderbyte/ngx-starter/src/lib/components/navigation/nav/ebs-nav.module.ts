import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EbsNavListComponent} from './nav-list/ebs-nav-list.component';
import { EbsNavLinkComponent } from './nav-link/ebs-nav-link.component';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {A11yModule} from '@angular/cdk/a11y';

export {EbsNavListComponent} from './nav-list/ebs-nav-list.component';
export {EbsNavLinkComponent} from './nav-link/ebs-nav-link.component';

@NgModule({
  declarations: [EbsNavListComponent, EbsNavLinkComponent],
  exports: [EbsNavListComponent, EbsNavLinkComponent],
  imports: [
    CommonModule, RouterModule,

    MatIconModule, MatButtonModule,
    A11yModule,

    TranslateModule, FlexLayoutModule
  ]
})
export class EbsNavModule { }
