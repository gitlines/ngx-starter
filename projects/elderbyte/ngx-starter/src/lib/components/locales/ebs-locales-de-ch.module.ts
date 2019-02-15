import {APP_INITIALIZER, LOCALE_ID, ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {
  MAT_DATE_LOCALE
} from '@angular/material';
import localeDECH from '@angular/common/locales/de-CH';

// Because of AOT Compiler
export function registerLocale() {
  // Hack to use Lambda here! See
  // https://stackoverflow.com/questions/51976671/app-initializer-in-library-causes-lambda-not-supported-error
  const x = 2 + 4;
  return () => registerLocaleData(localeDECH);
}

@NgModule({
  imports: [
    // common
    CommonModule,
  ],
  declarations: [],
  exports: []
})
export class EbsLocalesDeChModule {

  static forRoot(): ModuleWithProviders {

    return {
      ngModule: EbsLocalesDeChModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: registerLocale,
          multi: true
        },
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
