import {Component, Input, OnInit} from '@angular/core';
import {ElderLanguageService} from '../elder-language.service';
import {LoggerFactory} from '@elderbyte/ts-logger';

@Component({
    selector: 'elder-language-switcher, ebs-language-switcher',
    templateUrl: './elder-language-switcher.component.html',
    styleUrls: ['./elder-language-switcher.component.scss']
})
export class ElderLanguageSwitcherComponent implements OnInit {


    private readonly logger = LoggerFactory.getLogger('ElderLanguageSwitcherComponent');

    @Input()
    public slimMode: boolean;

    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/

    constructor(
        public language: ElderLanguageService) {

    }

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/


    public get currentLanguage(): string {
        return this.language.currentLanguage;
    }

    public set currentLanguage(lang: string) {
        this.language.currentLanguage = lang;
    }

    public get languages(): Array<string> {
        return this.language.languages;
    }

    public setLanguage(lang: string) {
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

    public isLanguageActive(lang: string): boolean {
        return this.language.isLanguageActive(lang);
    }

}
