
import {DataContext, IDataContext} from './data-context';
import {PagedDataContext} from './data-context-paged';
import {Page, Pageable, Sort} from './page';
import {Filter} from './filter';
import {Observable} from 'rxjs/Observable';
import {MaterialDataContext} from './data-context-material';
import {NGXLogger} from 'ngx-logger';


/**
 * Provides the ability to build a IDataContext<T>.
 */
export class DataContextBuilder<T> {

    private _indexFn?: ((item: T) => any);
    private _localSort?: (a: T, b: T) => number;
    private _localApply?: ((data: T[]) => T[]);
    private _pageSize = 30;
    private _materialSupport = false;

    /**
     * Creates a new DataContextBuilder.
     * @param {NGXLogger} logger A global logger instance
     * @returns {DataContextBuilder<T>} The type of data to manage.
     */
    public static  start<T>(logger: NGXLogger): DataContextBuilder<T> {
        if (!logger) throw new Error("You need to provide an instance of the logger!");
        return new DataContextBuilder<T>(logger);
    }

    constructor(
        private logger: NGXLogger
    ) { }


    public indexBy(indexFn?: ((item: T) => any)): DataContextBuilder<T> {
        this._indexFn = indexFn;
        return this;
    }

    public pageSize(size: number): DataContextBuilder<T> {
        this._pageSize = size;
        return this;
    }

    /**
     * Adds support for Material DataSource to the resulting DataContext
     * @returns {DataContextBuilder<T>}
     */
    public mdDataSource(): DataContextBuilder<T> {
        this._materialSupport = true;
        return this;
    }

    public localSorted(localSort: (a: T, b: T) => number): DataContextBuilder<T> {
        this._localSort = localSort;
        return this;
    }

    public localApply(localApply?: ((data: T[]) => T[])): DataContextBuilder<T> {
        this._localApply = localApply;
        return this;
    }

    public build( listFetcher: (sorts: Sort[], filters?: Filter[]) => Observable<Array<T>>): IDataContext<T> {
        return this.applyProxies(new DataContext<T>(
            this.logger,
            listFetcher,
            this._indexFn,
            this._localSort,
            this._localApply));
    }


    public buildPaged(
        pageLoader: (pageable: Pageable, filters?: Filter[]) => Observable<Page<T>>
    ): IDataContext<T> {

        return this.applyProxies(new PagedDataContext<T>(
            this.logger,
            pageLoader,
            this._pageSize,
            this._indexFn,
            this._localSort,
            this._localApply
        ));
    }

    public buildEmpty(): IDataContext<T> {
        let emptyContext = new DataContext<T>(this.logger, (a, b) => Observable.empty());
        return this.applyProxies(emptyContext);
    }

    private applyProxies(context:  IDataContext<T>): IDataContext<T> {
        if (this._materialSupport) {
            context = new MaterialDataContext(context);
        }
        return context;
    }

}
