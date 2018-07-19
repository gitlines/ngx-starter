
import {DataContextContinuablePaged} from './data-context-continuable-paged';
import {Page, Pageable, PageRequest} from '../page';
import {Filter} from '../filter';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {DataContextSimple} from './data-context-simple';
import {DataContextActivePage} from './data-context-active-page';
import {Sort} from '../sort';
import {ContinuableListing} from '../continuable-listing';
import {DataContextContinuableToken} from './data-context-continuable-token';
import {EMPTY, Observable} from 'rxjs';
import {Sort as MatSortRequest} from '@angular/material';
import {map} from 'rxjs/operators';
import {DataContextActivePageLocal} from './data-context-active-page-local';
import {RestClientPaged} from '../rest/rest-client-paged';
import {RestClientContinuable} from '../rest/rest-client-continuable';
import {RestClientList} from '../rest/rest-client-list';
import {TokenChunkRequest} from '../token-chunk-request';
import {IDataContext, IDataContextActivePage, IDataContextContinuable} from './data-context';

/**
 * Provides the ability to build a IDataContext<T>.
 */
export class DataContextBuilder<T> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger = LoggerFactory.getLogger('DataContextBuilder');

    private _indexFn?: ((item: T) => any);
    private _localSort?: (a: T, b: T) => number;
    private _localApply?: ((data: T[]) => T[]);
    private _activeSort?: Observable<Sort>;
    private _pageSize = 30;

    /***************************************************************************
     *                                                                         *
     * Static                                                                  *
     *                                                                         *
     **************************************************************************/

    /**
     * Creates a new DataContextBuilder.
     * @returns A new DataContextBuilder for the given data type.
     */
    public static  start<T>(): DataContextBuilder<T> {
        return new DataContextBuilder<T>();
    }

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor() { }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    /**
     * Optional index function where each element will be indexed by.
     * If you have configured this, you can use the findByIndex(key) on the data-context.
     */
    public indexBy(indexFn?: ((item: T) => any)): DataContextBuilder<T> {
        this._indexFn = indexFn;
        return this;
    }

    /**
     * The desired size of a page/chunk when loading data.
     * Note that continuable apis might just take this as a wish or even completely ignore this param.
     */
    public pageSize(size: number): DataContextBuilder<T> {
        this._pageSize = size;
        return this;
    }

    /**
     * Adds support for Material DataSource to the resulting DataContextSimple
     * @deprecated This is no longer required as Material-DataContext is supported by default now
     */
    public mdDataSource(): DataContextBuilder<T> {
        return this;
    }

    /**
     * Sort the data context locally by the given sort function.
     *
     * Note that this might be a costly operation when there are a lot of elements present.
     * Prefer server side sorting if possible.
     */
    public localSorted(localSort: (a: T, b: T) => number): DataContextBuilder<T> {
        this._localSort = localSort;
        return this;
    }

    /**
     * Bind the data-context to the given reactive sort source.
     */
    public activeSorted(activeSort: Observable<Sort>): DataContextBuilder<T> {
        this._activeSort = activeSort;
        return this;
    }

    /**
     * Bind the data-context to the given reactive material sort source.
     */
    public activeSortedMat(activeSort: Observable<MatSortRequest>): DataContextBuilder<T> {
        this._activeSort = activeSort.pipe(
            map(matSort => new Sort(matSort.active, matSort.direction))
        );
        return this;
    }

    /**
     * For each element which is added to the datacontext, apply the given function.
     */
    public localApply(localApply?: ((data: T[]) => T[])): DataContextBuilder<T> {
        this._localApply = localApply;
        return this;
    }

    /***************************************************************************
     *                                                                         *
     * Builder                                                                 *
     *                                                                         *
     **************************************************************************/

    public build( listFetcher: (sorts: Sort[], filters?: Filter[]) => Observable<Array<T>>): IDataContext<T> {
        return new DataContextSimple<T>(
            listFetcher,
            this._indexFn,
            this._localSort,
            this._localApply,
            this._activeSort,
        );
    }

    public buildClient(
        restClient: RestClientList<T, any>
    ): IDataContext<T> {
        return this.build(
            (sorts, filters) => restClient.findAllFiltered(filters, sorts)
        );
    }

    public buildPagedClient(
        restClient: RestClientPaged<T, any>
    ): IDataContextContinuable<T> {
        return this.buildPaged(
            (pageable, filters) => restClient.findAllPaged(pageable, filters)
        );
    }

    public buildPaged(
        pageLoader: (pageable: Pageable, filters?: Filter[]) => Observable<Page<T>>
    ): IDataContextContinuable<T> {

        return new DataContextContinuablePaged<T>(
            pageLoader,
            this._pageSize,
            this._indexFn,
            this._localSort,
            this._localApply,
            this._activeSort,
        );
    }

    public buildContinuationToken(
        nextChunkLoader: (tokenChunkRequest: TokenChunkRequest) => Observable<ContinuableListing<T>>
    ): IDataContextContinuable<T> {
        return new DataContextContinuableToken<T>(
            nextChunkLoader,
            this._pageSize,
            this._indexFn,
            this._localSort,
            this._localApply,
            this._activeSort,
        );
    }

    public buildContinuationTokenClient(
        restClient: RestClientContinuable<T, any>
    ): IDataContextContinuable<T> {
        return this.buildContinuationToken(
            (request) => restClient.findAllContinuable(request)
        );
    }

    public buildActivePaged(
        pageLoader: ((pageable: Pageable, filters?: Filter[]) => Observable<Page<T>>),
        activePage?: Observable<PageRequest>
    ): IDataContextActivePage<T> {
        return new DataContextActivePage<T>(
            pageLoader,
            this._pageSize,
            this._indexFn,
            this._localSort,
            this._localApply,
            this._activeSort,
            activePage
        );
    }

    public buildActivePagedClient(
        restClient: RestClientPaged<T, any>,
        activePage?: Observable<PageRequest>
    ): IDataContextActivePage<T> {
        return this.buildActivePaged(
            (pageable, filters) => restClient.findAllPaged(pageable, filters),
            activePage
        );
    }

    public buildLocalActivePaged(
        data: T[],
        activePage?: Observable<PageRequest>
    ): IDataContextActivePage<T> {

        return new DataContextActivePageLocal<T>(
            data,
            this._pageSize,
            this._indexFn,
            this._localSort,
            this._localApply,
            this._activeSort,
            activePage
        );
    }

    public buildEmpty(): IDataContext<T> {
        return new DataContextSimple<T>( (a, b) => EMPTY);
    }

    public buildEmptyContinuable(): IDataContextContinuable<T> {
        return new DataContextContinuablePaged<T>(
            (a, b) => EMPTY,
            this._pageSize,
            this._indexFn,
            this._localSort,
            this._localApply,
            this._activeSort,
        );
    }

    public buildEmptyActivePaged(): IDataContextActivePage<T> {
        return new DataContextActivePage<T>(
            (a, b) => EMPTY,
            this._pageSize,
            this._indexFn,
            this._localSort,
            this._localApply,
            this._activeSort,
        );
    }
}
