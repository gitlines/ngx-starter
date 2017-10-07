
import {DataContext, IDataContext} from './data-context';
import {PagedDataContext} from './data-context-paged';
import {Page, Pageable, Sort} from './page';
import {Filter} from './filter';
import {Observable} from 'rxjs/Observable';
import {MaterialDataContext} from './data-context-material';
import {NGXLogger, NgxLoggerLevel} from 'ngx-logger';
import {HttpClient} from '@angular/common/http';

/**
 * Provides the ability to build a IDataContext<T>.
 */
export class DataContextBuilder<T> {

    private _indexFn?: ((item: T) => any);
    private _localSort?: (a: T, b: T) => number;
    private _pageSize = 30;
    private _materialSupport = false;

    /**
     * Creates a new DataContextBuilder.
     * @param {NGXLogger} globalLogger A global logger instance (optional)
     * @returns {DataContextBuilder<T>} The type of data to manage.
     */
    public static  start<T>(globalLogger?: NGXLogger): DataContextBuilder<T> {
        const logger: NGXLogger = globalLogger || DataContextBuilder.buildFallbackLogger();
        return new DataContextBuilder<T>(logger);
    }

    private static buildFallbackLogger(): NGXLogger {
        return new NGXLogger(<HttpClient>{}, {
            level: NgxLoggerLevel.DEBUG,
            serverLogLevel: NgxLoggerLevel.OFF
        });
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

    public build( listFetcher: (sorts: Sort[], filters?: Filter[]) => Observable<Array<T>>): IDataContext<T> {
        return this.applyProxies(new DataContext<T>(
            this.logger,
            listFetcher,
            this._indexFn,
            this._localSort));
    }


    public buildPaged(
        pageLoader: (pageable: Pageable, filters?: Filter[]) => Observable<Page<T>>
    ): IDataContext<T> {

        return this.applyProxies(new PagedDataContext<T>(
            this.logger,
            pageLoader,
            this._pageSize,
            this._indexFn,
            this._localSort
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
