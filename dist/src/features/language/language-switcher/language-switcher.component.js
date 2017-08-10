import { Component, Input } from '@angular/core';
import { LanguageService } from "../language.service";
var LanguageSwitcherComponent = (function () {
    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/
    function LanguageSwitcherComponent(language) {
        this.language = language;
    }
    Object.defineProperty(LanguageSwitcherComponent.prototype, "currentLanguage", {
        get: function () {
            return this.language.currentLanguage;
        },
        set: function (lang) {
            this.language.currentLanguage = lang;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageSwitcherComponent.prototype, "languages", {
        get: function () {
            return this.language.languages;
        },
        enumerable: true,
        configurable: true
    });
    LanguageSwitcherComponent.prototype.setLanguage = function (lang) {
        this.currentLanguage = lang;
    };
    /***************************************************************************
     *                                                                         *
     * Lifecycle Hooks                                                         *
     *                                                                         *
     **************************************************************************/
    LanguageSwitcherComponent.prototype.ngOnInit = function () {
    };
    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/
    LanguageSwitcherComponent.prototype.isLanguageActive = function (lang) {
        return this.language.isLanguageActive(lang);
    };
    LanguageSwitcherComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-language-switcher',
                    templateUrl: './language-switcher.component.html',
                    styleUrls: ['./language-switcher.component.scss']
                },] },
    ];
    /** @nocollapse */
    LanguageSwitcherComponent.ctorParameters = function () { return [
        { type: LanguageService, },
    ]; };
    LanguageSwitcherComponent.propDecorators = {
        'slimMode': [{ type: Input, args: ['slimMode',] },],
    };
    return LanguageSwitcherComponent;
}());
export { LanguageSwitcherComponent };
//# sourceMappingURL=language-switcher.component.js.map