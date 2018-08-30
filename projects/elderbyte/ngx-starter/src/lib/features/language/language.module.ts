import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LanguageSwitcherComponent} from './language-switcher/language-switcher.component';
import {LanguageService} from './language.service';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule, MatIconModule, MatMenuModule, MatSelectModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {SimpleWebStorageModule} from '@elderbyte/ngx-simple-webstorage';
import {LanguageInterceptor} from './language.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';


export * from './language.service';
export * from './language-switcher/language-switcher.component';
export * from './language.interceptor';


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
        LanguageSwitcherComponent,
    ],
    declarations: [
        LanguageSwitcherComponent
    ]
})
export class LanguageModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: LanguageModule,
            providers: [
                LanguageService,
                { provide: HTTP_INTERCEPTORS, useClass: LanguageInterceptor, multi: true }
            ]
        };
    }
}
