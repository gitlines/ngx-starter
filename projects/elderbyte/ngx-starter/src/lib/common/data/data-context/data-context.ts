import {DataContextStatus} from './data-context-status';
import {Observable} from 'rxjs';
import {Sort} from '../sort';
import {Filter} from '../filter';
import {FilterContext} from '../filter-context';
import {PageRequest} from '../page';


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
   * Observable which emits the current data over time.
   */
  readonly data: Observable<T[]>;

  /**
   * Gets the current data in the data-context
   */
  readonly dataSnapshot: T[];

  /**
   * Indicates if the context currently holds no data
   */
  readonly isEmpty: boolean;

  /**
   * Indicates if data is loading over time
   */
  readonly loading: Observable<boolean>;

  /**
   * Gets the current loading status
   */
  readonly loadingSnapshot: boolean;

  /**
   * The total count of all elements over time
   * (I.e. the expected count when the data contex is completed)
   */
  readonly total: Observable<number | undefined>;

  /**
   * The current total count of all elements
   */
  readonly totalSnapshot: number | undefined;

  /**
   * Observable which emits when the status changes (i.e. error)
   */
  readonly status: Observable<DataContextStatus>;

  /**
   * Gets the current status
   */
  readonly statusSnapshot: DataContextStatus;

  /**
   * Gets the current sorts
   */
  sorts: Sort[];

  /**
   * Gets the current single sort
   */
  sort: Sort;

  /**
   * Gets the current filters
   */
  readonly filters: Filter[];

  /**
   * Gets the current filter context. Changes in this context are reflected by the data-context.
   */
  filterContext: FilterContext;

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

  findByIndex(key: any): T | undefined;

}

/**
 * Represents a data-context which backs a infinite like data stream
 * where more data will be loaded and added to the backing rows.
 */
export interface IDataContextContinuable<T> extends IDataContext<T> {

  /**
   * Returns true if this datacontext can load more data
   */
  readonly hasMoreData: boolean;

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
