import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WebLocalStorage } from '@elderbyte/ngx-simple-webstorage';

@Injectable()
export class LanguageService {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private LANGUAGE_STORAGE_KEY = 'language';

    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/

    constructor(
        private translate: TranslateService,
        private webStorage: WebLocalStorage
    ) {
        console.log('Initializing language service with webstore: ', webStorage);
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    /**
     * Returns the key of the currently applied language.
     *
     * @returns {string} language key
     */
    public get currentLanguage(): string {
        return this.translate.currentLang;
    }

    /**
     * Applies the given language which will immediately get apparent
     * in the UI.
     *
     * @param {string} lang language key
     */
    public set currentLanguage(lang: string) {
        this.setLanguage(lang);
    }

    /**
     * Returns an array of all available language keys.
     *
     * @returns {Array<string>} e.g. ['en', 'de', 'fr']
     */
    public get languages(): Array<string> {
        return this.translate.getLangs();
    }

    /**
     * Checks if the given language is currently active.
     *
     * @param {string} lang language key
     * @returns {boolean} true if given language is currently active
     */
    public isLanguageActive(lang: string): boolean {
        return this.currentLanguage === lang;
    }

    /**
     * Returns the key of the last applied language.
     *
     * @returns {string} language key of last applied language
     */
    public get lastConfigured(): string {
        return this.webStorage.getItem(this.LANGUAGE_STORAGE_KEY);
    }

    /***************************************************************************
     *                                                                         *
     * Private Methods                                                         *
     *                                                                         *
     **************************************************************************/

    private setLanguage(lang: string): void {
        this.translate.use(lang);
        this.webStorage.setItem(this.LANGUAGE_STORAGE_KEY, lang);
    }

}
