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
     * Gets the current rows in the data-context
     */
    readonly rows: T[];

    /**
     * Indicates if the context holds no data
     */
    readonly isEmpty: boolean;

    /**
     * Indicates that data is currently loading
     */
    readonly loadingIndicator: boolean;

    /**
     * The total count of all elements
     */
    readonly total: number | undefined;

    /**
     * Observable which emits when the data-context rows change
     */
    readonly rowsChanged: Observable<T[]>;

    /**
     * Observable which emits when the status changes (i.e. error)
     */
    readonly statusChanged: Observable<DataContextStatus>;
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
     * Reloads the current active data.
     */
    reload(): Observable<any>;

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
