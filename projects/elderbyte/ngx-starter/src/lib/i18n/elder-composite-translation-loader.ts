import {TranslateLoader} from '@ngx-translate/core';
import {Observable} from 'rxjs';

export class ElderCompositeTranslationLoader implements TranslateLoader {


    constructor() {
    }

    getTranslation(lang: string): Observable<any> {
        return undefined;
    }

}
