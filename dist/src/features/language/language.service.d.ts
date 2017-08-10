import { TranslateService } from "@ngx-translate/core";
import { WebLocalStorage } from "@elderbyte/ngx-simple-webstorage";
export declare class LanguageService {
    private translate;
    private webStorage;
    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/
    private LANGUAGE_STORAGE_KEY;
    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/
    constructor(translate: TranslateService, webStorage: WebLocalStorage);
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
    /**
     * Applies the given language which will immediately get apparent
     * in the UI.
     *
     * @param {string} lang language key
     */
    currentLanguage: string;
    /**
     * Returns an array of all available language keys.
     *
     * @returns {Array<string>} e.g. ['en', 'de', 'fr']
     */
    readonly languages: Array<string>;
    /**
     * Checks if the given language is currently active.
     *
     * @param {string} lang language key
     * @returns {boolean} true if given language is currently active
     */
    isLanguageActive(lang: string): boolean;
    /**
     * Returns the key of the last applied language.
     *
     * @returns {string} language key of last applied language
     */
    readonly lastConfigured: string;
    /***************************************************************************
     *                                                                         *
     * Private Methods                                                         *
     *                                                                         *
     **************************************************************************/
    private setLanguage(lang);
}
