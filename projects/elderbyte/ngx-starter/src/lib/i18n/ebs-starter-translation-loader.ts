import {TranslateLoader} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';

export class EbsStarterTranslationLoader implements TranslateLoader {

    private translations = new Map<string, any>();

    constructor() {

        this.translations.set('en', {

        });

        this.translations.set('de', {

        });
    }


    getTranslation(lang: string): Observable<any> {
        return of(this.translations.get(lang)) ;
    }
}
