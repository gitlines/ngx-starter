import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EbsSelectListComponent } from './ebs-select-list/ebs-select-list.component';
import { EbsSelectListItemComponent } from './ebs-select-list-item/ebs-select-list-item.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {A11yModule} from '@angular/cdk/a11y';
import {TranslateModule} from '@ngx-translate/core';

export {EbsSelectListComponent} from './ebs-select-list/ebs-select-list.component';
export {EbsSelectListItemComponent} from './ebs-select-list-item/ebs-select-list-item.component';


@NgModule({
  declarations: [EbsSelectListComponent, EbsSelectListItemComponent],
  exports: [EbsSelectListComponent, EbsSelectListItemComponent],
  imports: [
    CommonModule,

    MatIconModule, MatButtonModule,
    A11yModule,

    TranslateModule, FlexLayoutModule
  ]
})
export class EbsSelectListModule { }
