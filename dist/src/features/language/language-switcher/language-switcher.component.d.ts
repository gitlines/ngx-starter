import { OnInit } from '@angular/core';
import { LanguageService } from "../language.service";
export declare class LanguageSwitcherComponent implements OnInit {
    language: LanguageService;
    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/
    constructor(language: LanguageService);
    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/
    slimMode: boolean;
    currentLanguage: string;
    readonly languages: Array<string>;
    setLanguage(lang: string): void;
    /***************************************************************************
     *                                                                         *
     * Lifecycle Hooks                                                         *
     *                                                                         *
     **************************************************************************/
    ngOnInit(): void;
    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/
    isLanguageActive(lang: string): boolean;
}
