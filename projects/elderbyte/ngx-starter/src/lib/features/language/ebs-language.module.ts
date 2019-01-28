import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {EbsLanguageSwitcherComponent} from './language-switcher/ebs-language-switcher.component';
import {EbsLanguageService} from './ebs-language.service';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule, MatIconModule, MatMenuModule, MatSelectModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {SimpleWebStorageModule} from '@elderbyte/ngx-simple-webstorage';
import {EbsLanguageInterceptor} from './ebs-language-interceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';


export * from './ebs-language.service';
export * from './language-switcher/ebs-language-switcher.component';
export * from './ebs-language-interceptor.service';


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
        EbsLanguageSwitcherComponent,
    ],
    declarations: [
        EbsLanguageSwitcherComponent
    ]
})
export class EbsLanguageModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: EbsLanguageModule,
            providers: [
                EbsLanguageService,
                { provide: HTTP_INTERCEPTORS, useClass: EbsLanguageInterceptor, multi: true }
            ]
        };
    }
}
