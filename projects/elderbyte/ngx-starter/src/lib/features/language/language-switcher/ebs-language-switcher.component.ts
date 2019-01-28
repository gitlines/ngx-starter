import {Component, Input, OnInit} from '@angular/core';
import {EbsLanguageService} from '../ebs-language.service';
import {LoggerFactory} from '@elderbyte/ts-logger';

@Component({
    selector: 'ebs-language-switcher',
    templateUrl: './ebs-language-switcher.component.html',
    styleUrls: ['./ebs-language-switcher.component.scss']
})
export class EbsLanguageSwitcherComponent implements OnInit {


    private readonly logger = LoggerFactory.getLogger('EbsLanguageSwitcherComponent');

    @Input()
    public slimMode: boolean;

    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/

    constructor(
        public language: EbsLanguageService) {

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
