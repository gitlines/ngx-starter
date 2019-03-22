import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ElderLanguageSwitcherComponent} from './language-switcher/elder-language-switcher.component';
import {ElderLanguageService} from './elder-language.service';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule, MatIconModule, MatMenuModule, MatSelectModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {SimpleWebStorageModule} from '@elderbyte/ngx-simple-webstorage';
import {ElderLanguageInterceptor} from './elder-language-interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';


export * from './elder-language.service';
export * from './language-switcher/elder-language-switcher.component';
export * from './elder-language-interceptor';


export class ElderLanguageConfig {

  interceptor?: {

    /**
     * Globally disable request interceptor
     * (By default enabled)
     */
    disable?: boolean;

    /**
     * Configure a query param to use for the request interceptor
     * (By default 'locale')
     */
    queryParam?: string;
  };

}

/**
 * Provides language related functionality like
 * language-switcher, language service etc.
 */
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SimpleWebStorageModule,

    MatSelectModule,
    MatIconModule, MatButtonModule,
    MatMenuModule,
    FlexLayoutModule,

    FormsModule
  ],
  exports: [
    ElderLanguageSwitcherComponent,
  ],
  declarations: [
    ElderLanguageSwitcherComponent
  ]
})
export class ElderLanguageModule {

  static forRoot(config?: ElderLanguageConfig): ModuleWithProviders {
    return {
      ngModule: ElderLanguageModule,
      providers: [
        {
          provide: ElderLanguageConfig,
          useValue: config,
        },

        ElderLanguageService,

        { provide: HTTP_INTERCEPTORS, useClass: ElderLanguageInterceptor, multi: true }

      ]
    };
  }
}
