import {LOCALE_ID, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DATE_LOCALE
} from '@angular/material';
import {registerLocaleData} from '@angular/common';
import localeDECH from '@angular/common/locales/de-CH';

// register dc-ch locale
registerLocaleData(localeDECH);

@NgModule({
  imports: [
    // common
    CommonModule,

    // navigation

    // layout

    // forms

    // form controls

    // buttons & indicators

    // popups & modals

    // data table

    // translations
  ],
  declarations: [],
  exports: [],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'de-CH'}, // setting Swiss German as default locale for DatePicker
    {provide: LOCALE_ID, useValue: 'de-CH'}, // setting Swiss German as default locale
  ],
})
export class EbsLocalesDeChModule { }
