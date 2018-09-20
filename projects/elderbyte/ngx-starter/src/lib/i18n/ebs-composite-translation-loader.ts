import {TranslateFakeLoader, TranslateLoader, TranslateParser} from '@ngx-translate/core';
import {Observable} from 'rxjs';

export class EbsCompositeTranslationLoader implements TranslateLoader {


    constructor() {
    }

    getTranslation(lang: string): Observable<any> {
        return undefined;
    }

}
