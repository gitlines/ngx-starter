import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WebLocalStorage } from '@elderbyte/ngx-simple-webstorage';
import {LoggerFactory} from '@elderbyte/ts-logger';

@Injectable()
export class ElderLanguageService {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderLanguageService');

  private LANGUAGE_STORAGE_KEY = 'language';

  /***************************************************************************
   *                                                                         *
   * Constructors                                                            *
   *                                                                         *
   **************************************************************************/

  constructor(
    private translate: TranslateService,
    private webStorage: WebLocalStorage
  ) {
    this.logger.trace('Initializing language service with webstore: ', webStorage);

    // this.translate.addLangs(['en', 'de']);
    // this.translate.defaultLang = 'en';

    this.applyPreferredLanguage();
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Returns the key of the currently applied language.
   *
   * @returns language key
   */
  public get currentLanguage(): string {
    return this.translate.currentLang;
  }

  /**
   * Applies the given language which will immediately get apparent
   * in the UI.
   *
   * @param lang language key
   */
  public set currentLanguage(lang: string) {
    this.setLanguageAndRemember(lang);
  }

  /**
   * Returns an array of all available language keys.
   *
   * @returns e.g. ['en', 'de', 'fr']
   */
  public get languages(): Array<string> {
    return this.translate.getLangs();
  }

  /**
   * Checks if the given language is currently active.
   *
   * @param lang language key
   * @returns true if given language is currently active
   */
  public isLanguageActive(lang: string): boolean {
    return this.currentLanguage === lang;
  }

  /**
   * Returns the key of the last applied language.
   *
   * @returns language key of last applied language
   */
  public get lastConfigured(): string | undefined {
    return this.lookupPreferredLanguage();
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public lookupPreferredLanguage(): string | undefined {
    return this.webStorage.getItem(this.LANGUAGE_STORAGE_KEY);
  }

  public forgetPreferredLanguage(): void {
    this.webStorage.removeItem(this.LANGUAGE_STORAGE_KEY);
  }

  public rememberPreferredLanguage(lang: string): void {
    this.webStorage.setItem(this.LANGUAGE_STORAGE_KEY, lang);
  }

  public applyPreferredLanguage(): void {
    const preferred = this.lookupPreferredLanguage();
    if (preferred) {
      this.setLanguage(preferred);
    } else {
      this.translate.use(this.translate.getBrowserLang());
    }
  }

  /***************************************************************************
   *                                                                         *
   * Private Methods                                                         *
   *                                                                         *
   **************************************************************************/

  private setLanguageAndRemember(lang: string): void {
    this.setLanguage(lang);
    this.rememberPreferredLanguage(lang);
  }

  private setLanguage(lang: string): void {
    this.translate.use(lang);
  }

}
