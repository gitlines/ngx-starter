import {DataContextStatus} from './data-context-status';
import {Observable} from 'rxjs';
import {Sort} from '../sort';
import {Filter} from '../filter';
import {FilterContext} from '../filter-context';
import {PageRequest} from '../page';
import {SortContext} from '../sort-context';


export class DataContextSnapshot<T> {
  constructor(
    public readonly data: T[],
    public readonly isEmpty: boolean,
    public readonly isLoading: boolean,
    public readonly total: number | undefined,
    public readonly status: DataContextStatus
  ) { }
}

/**
 * Manages a set of data (rows) which are to be displayed in a UI Component.
 *
 */
export interface IDataContext<T> {

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Gets a snapshot of the current state in this data-context
   */
  readonly snapshot: DataContextSnapshot<T>;

  /**
   * Observable which emits the current data over time.
   */
  readonly data: Observable<T[]>;

  /**
   * Indicates if the context currently holds no data
   */
  readonly isEmpty: boolean;

  /**
   * Indicates if data is loading over time
   */
  readonly loading: Observable<boolean>;

  /**
   * The total count of all elements over time
   * (I.e. the expected count when the data contex is completed)
   */
  readonly total: Observable<number | undefined>;

  /**
   * Observable which emits when the status changes (i.e. error)
   */
  readonly status: Observable<DataContextStatus>;

  /**
   * Gets the sort context. Changes in this context are reflected by the data-context.
   */
  readonly sort: SortContext;

  /**
   * Gets the filter context. Changes in this context are reflected by the data-context.
   */
  readonly filter: FilterContext;

  /***************************************************************************
   *                                                                         *
   * API                                                                     *
   *                                                                         *
   **************************************************************************/

  /**
   * Starts populating data context by loading first
   * batch of data.
   */
  start(sorts?: Sort[], filters?: Filter[]): Observable<any>;

  /**
   * Requests a reload.
   */
  reload(): void;

  /**
   * Closes the data-context and cleans up resources
   */
  close(): void;

  /**
   * Returns the item by the given index key.
   * Requires that index functionality is enabled.
   * @param key
   */
  findByIndex(key: any): T | undefined;

}

/**
 * Represents a data-context which backs a infinite like data stream
 * where more data will be loaded and added to the backing rows.
 */
export interface IDataContextContinuable<T> extends IDataContext<T> {

  /**
   * Returns true if this data-context can load more data
   */
  readonly hasMoreDataSnapshot: boolean;

  /**
   * Returns true if this data-context can load more data over time
   */
  readonly hasMoreData: Observable<boolean>;

  /**
   * Loads more data if any available.
   * E.g. next page.
   *
   */
  loadMore(): Observable<any>;

  /**
   * Loads all available data. In case of
   * paged context loads page by page until finished.
   */
  loadAll(sorts?: Sort[], filters?: Filter[]): void;

}

export interface IDataContextActivePage<T> extends IDataContext<T> {

  pageIndex: number;

  pageSize: number;

  page: PageRequest;

}
