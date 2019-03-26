import { Observable } from 'rxjs/internal/Observable';
import {SearchInputState} from './search-input-state';



/**
 * Represents a single search name.
 */
export interface SearchInput {

  /**
   * The search input name
   */
  readonly name: string;

  readonly state$: Observable<SearchInputState>;

  readonly stateSnapshot: SearchInputState;

  /**
   * States if the search name is cannot be changed.
   */
  readonly readonly?: boolean;

  /**
   * Reset the name value
   */
  reset(): void;
}

