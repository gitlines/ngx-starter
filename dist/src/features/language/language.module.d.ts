import { ModuleWithProviders } from '@angular/core';
export * from "./language.service";
export * from "./language-switcher/language-switcher.component";
/**
 * Provides language related functionality like
 * language-switcher, language service etc.
 */
export declare class LanguageModule {
    static forRoot(): ModuleWithProviders;
}
