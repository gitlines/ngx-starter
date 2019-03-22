import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DateAdapter,
  MatButtonModule, MatDatepickerModule, MatIconModule,
  MatInputModule, MatNativeDateModule, MatTooltipModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { ElderDateSwitcherComponent } from './ebs-date-switcher/elder-date-switcher.component';
import { CustomDateAdapter } from './date-adapters/custom-date-adapter';

@NgModule({
  imports: [
    // common
    CommonModule, MatNativeDateModule,

    // navigation

    // layout
    FlexLayoutModule,

    // forms
    FormsModule,

    // form controls
    MatInputModule, MatDatepickerModule,

    // buttons & indicators
    MatButtonModule, MatIconModule,

    // popups & modals
    MatTooltipModule,

    // data matTable

    // translations
    TranslateModule
  ],
  declarations: [
    ElderDateSwitcherComponent
  ],
  exports: [
    ElderDateSwitcherComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter}
  ]
})
export class ElderDatesModule { }
