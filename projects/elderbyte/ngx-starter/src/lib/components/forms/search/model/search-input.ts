import { Observable } from 'rxjs/internal/Observable';
import {SearchInputState} from './search-input-state';



/**
 * Represents a single search attribute.
 */
export interface SearchInput {

  /**
   * The attribute name
   */
  readonly attribute: string;

  readonly state$: Observable<SearchInputState>;

  readonly stateSnapshot: SearchInputState;

  /**
   * States if the search attribute is cannot be changed.
   */
  readonly readonly?: boolean;

  /**
   * Reset the attribute value
   */
  reset(): void;
}

