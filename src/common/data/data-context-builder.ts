
import {IDataContext, IDataContextActivePage, IDataContextContinuable} from './data-context';
import {DataContextContinuablePaged} from './data-context-continuable-paged';
import {Page, Pageable, PageRequest} from './page';
import {Filter} from './filter';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {DataContextSimple} from './data-context-simple';
import {DataContextActivePage} from './data-context-active-page';
import {Sort} from './sort';
import {ContinuableListing} from './continuable-listing';
import {DataContextContinuableToken, TokenChunkRequest} from './data-context-continuable-token';
import {EMPTY, Observable} from 'rxjs/index';
import {PageEvent} from '@angular/material';


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

    constructor(
    ) { }

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
     * Note that this might be a costly operation when there are a lot of elements present.
     * Prefer server side sorting if possible.
     */
    public localSorted(localSort: (a: T, b: T) => number): DataContextBuilder<T> {
        this._localSort = localSort;
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
            this._localApply);
    }

    public buildPaged(
        pageLoader: (pageable: Pageable, filters?: Filter[]) => Observable<Page<T>>
    ): IDataContextContinuable<T> {

        return new DataContextContinuablePaged<T>(
            pageLoader,
            this._pageSize,
            this._indexFn,
            this._localSort,
            this._localApply
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
            this._localApply
        );
    }

    public buildActivePaged(
        pageLoader: (pageable: Pageable, filters?: Filter[]) => Observable<Page<T>>,
        activePage?: Observable<PageRequest>
    ): IDataContextActivePage<T> {

        return new DataContextActivePage<T>(
            pageLoader,
            this._pageSize,
            this._indexFn,
            this._localSort,
            this._localApply,
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
            this._localApply
        );
    }

    public buildEmptyActivePaged(): IDataContextActivePage<T> {
        return new DataContextActivePage<T>(
            (a, b) => EMPTY,
            this._pageSize,
            this._indexFn,
            this._localSort,
            this._localApply
        );
    }
}
