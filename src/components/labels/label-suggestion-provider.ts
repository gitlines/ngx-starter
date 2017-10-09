import {Observable} from 'rxjs/Observable';
import {Label} from './label';

export interface ISuggestionProvider {

  /**
   * Loads all suggestions, filtered by the given filter string.
   * @param {string} filter
   * @returns {Observable<Label[] | string[]>}
   */
  loadSuggestions(filter: string): Observable<Label[] | string[]>
}


export class SuggestionProvider implements ISuggestionProvider{

  public static build(provider: (filter: string) => Observable<Label[] | string[]>): ISuggestionProvider {
    return new SuggestionProvider(provider);
  }

  constructor(
    private provider: (filter: string) => Observable<Label[] | string[]>) {
  }

  public loadSuggestions(filter: string): Observable<Label[] | string[]> {
    return this.provider(filter);
  }
}




