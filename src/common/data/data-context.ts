import {Filter} from './filter';
import {Observable} from 'rxjs/Observable';
import {Sort} from './page';
import {DataContextStatus} from './data-context-status';


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

    readonly rows: T[];

    readonly sorts: Sort[];

    readonly filters: Filter[];

    /**
     * Indicates that data is currently loading
     */
    readonly loadingIndicator: boolean;


    /**
     * Observable which emits when the data-context rows change
     */
    readonly rowsChanged: Observable<T[]>;

    /**
     * Observable which emits when the status changes (i.e. error)
     */
    readonly statusChanged: Observable<DataContextStatus>;

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

    readonly total: number;

    pageIndex: number;

    pageSize: number;

}
