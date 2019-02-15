import {LOCALE_ID, ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DATE_LOCALE
} from '@angular/material';
import {registerLocaleData} from '@angular/common';
import localeDECH from '@angular/common/locales/de-CH';

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
  exports: []
})
export class EbsLocalesDeChModule {

  static forRoot(): ModuleWithProviders {

    // register dc-ch locale
    registerLocaleData(localeDECH);

    return {
      ngModule: EbsLocalesDeChModule,
      providers: [
        {
          provide: MAT_DATE_LOCALE, // setting Swiss German as default locale for DatePicker
          useValue: 'de-CH'
        },
        {
          provide: LOCALE_ID, // setting Swiss German as default locale
          useValue: 'de-CH'
        }
      ]
    };
  }

}
