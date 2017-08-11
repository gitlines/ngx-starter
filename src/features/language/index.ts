import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LanguageSwitcherComponent} from "./language-switcher/language-switcher.component";
import {LanguageService} from "./language.service";
import {TranslateModule} from "@ngx-translate/core";
import {MdSelectModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {SimpleWebStorageModule} from "@elderbyte/ngx-simple-webstorage";


export * from "./language.service"
export * from "./language-switcher/language-switcher.component"


/**
 * Provides language related functionality like
 * language-switcher, language service etc.
 */
@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        SimpleWebStorageModule,
        MdSelectModule,
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
                {
                    provide: LanguageService,
                    useClass: LanguageService
                },
            ]
        }
    }
}
