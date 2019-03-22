import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElderSelectListComponent } from './select-list/elder-select-list.component';
import { ElderSelectListItemComponent } from './select-list-item/elder-select-list-item.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {A11yModule} from '@angular/cdk/a11y';
import {TranslateModule} from '@ngx-translate/core';

export {ElderSelectListComponent} from './select-list/elder-select-list.component';
export {ElderSelectListItemComponent} from './select-list-item/elder-select-list-item.component';


@NgModule({
  declarations: [ElderSelectListComponent, ElderSelectListItemComponent],
  exports: [ElderSelectListComponent, ElderSelectListItemComponent],
  imports: [
    CommonModule,

    MatIconModule, MatButtonModule,
    A11yModule,

    TranslateModule, FlexLayoutModule
  ]
})
export class ElderSelectListModule { }
