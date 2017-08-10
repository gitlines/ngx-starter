import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { WebLocalStorage } from "@elderbyte/ngx-simple-webstorage";
var LanguageService = (function () {
    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/
    function LanguageService(translate, webStorage) {
        this.translate = translate;
        this.webStorage = webStorage;
        /***************************************************************************
         *                                                                         *
         * Fields                                                                  *
         *                                                                         *
         **************************************************************************/
        this.LANGUAGE_STORAGE_KEY = "language";
        console.log('Initializing language service with webstore: ', webStorage);
    }
    Object.defineProperty(LanguageService.prototype, "currentLanguage", {
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
        get: function () {
            return this.translate.currentLang;
        },
        /**
         * Applies the given language which will immediately get apparent
         * in the UI.
         *
         * @param {string} lang language key
         */
        set: function (lang) {
            this.setLanguage(lang);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageService.prototype, "languages", {
        /**
         * Returns an array of all available language keys.
         *
         * @returns {Array<string>} e.g. ['en', 'de', 'fr']
         */
        get: function () {
            return this.translate.getLangs();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks if the given language is currently active.
     *
     * @param {string} lang language key
     * @returns {boolean} true if given language is currently active
     */
    LanguageService.prototype.isLanguageActive = function (lang) {
        return this.currentLanguage === lang;
    };
    Object.defineProperty(LanguageService.prototype, "lastConfigured", {
        /**
         * Returns the key of the last applied language.
         *
         * @returns {string} language key of last applied language
         */
        get: function () {
            return this.webStorage.getItem(this.LANGUAGE_STORAGE_KEY);
        },
        enumerable: true,
        configurable: true
    });
    /***************************************************************************
     *                                                                         *
     * Private Methods                                                         *
     *                                                                         *
     **************************************************************************/
    LanguageService.prototype.setLanguage = function (lang) {
        this.translate.use(lang);
        this.webStorage.setItem(this.LANGUAGE_STORAGE_KEY, lang);
    };
    LanguageService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    LanguageService.ctorParameters = function () { return [
        { type: TranslateService, },
        { type: WebLocalStorage, },
    ]; };
    return LanguageService;
}());
export { LanguageService };
//# sourceMappingURL=language.service.js.map