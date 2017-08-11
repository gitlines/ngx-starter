import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from "../language.service";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'app-language-switcher',
    templateUrl: './language-switcher.component.html',
    styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit {

    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/

    constructor(
        public language: LanguageService)
    {}

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/

    @Input('slimMode')
    public slimMode: boolean;


    public get currentLanguage() : string {
        return this.language.currentLanguage;
    }

    public set currentLanguage(lang : string) {
        this.language.currentLanguage = lang;
    }

    public get languages() : Array<string> {
        return this.language.languages;
    }

    public setLanguage(lang: string){
        this.currentLanguage = lang;
    }

    /***************************************************************************
     *                                                                         *
     * Lifecycle Hooks                                                         *
     *                                                                         *
     **************************************************************************/

    ngOnInit() {
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public isLanguageActive(lang: string) : boolean {
        return this.language.isLanguageActive(lang);
    }

}
