import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EbsTableComponent } from './ebs-table/ebs-table.component';
import {TranslateModule} from '@ngx-translate/core';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatIconModule, MatPaginatorModule, MatProgressBarModule, MatSortModule, MatTableModule,
  MatTooltipModule
} from '@angular/material';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {FormSupportDirectivesModule} from '../../directives/forms/form-support-directives.module';
import {CdkTableModule} from '@angular/cdk/table';

export {EbsTableComponent} from './ebs-table/ebs-table.component';

@NgModule({
  imports: [
    CommonModule, RouterModule,

    // layout
    FlexLayoutModule, MatDividerModule,

    // forms
    FormsModule, FormSupportDirectivesModule,

    // form controls
    MatCheckboxModule,

    // buttons & indicators
    MatButtonModule, MatIconModule, MatBadgeModule,
    MatProgressBarModule,

    // data table
    CdkTableModule, MatTableModule, MatPaginatorModule, MatSortModule,

    // popups & modals
    MatDialogModule, MatTooltipModule,

    // translations
    TranslateModule,
  ],
  declarations: [EbsTableComponent],
  exports: [EbsTableComponent]
})
export class EbsTableModule { }
