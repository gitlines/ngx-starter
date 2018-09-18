import {Observable} from 'rxjs';

export interface ISuggestionProvider<T> {

  /**
   * Loads all suggestions, filtered by the given filter string.
   */
  loadSuggestions(filter: string | null): Observable<T[]>;
}


export class SuggestionProvider<T> implements ISuggestionProvider<T> {

  public static build<T>(provider: (filter: string) => Observable<T[]>): ISuggestionProvider<T> {
    return new SuggestionProvider<T>(provider);
  }

  constructor(
    private provider: (filter: string) => Observable<T[]>) {
  }

  public loadSuggestions(filter: string): Observable<T[]> {
    return this.provider(filter);
  }
}



