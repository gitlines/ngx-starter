
import {Filter} from './filter';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Sort} from './page';
import {Subject} from 'rxjs/Subject';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';


/**
 * Manages a set of data (rows) which are to be displayed in a UI Component.
 *
 */
export interface IDataContext<T> {

    // Properties
    rows: T[];
    readonly total: number;
    readonly sorts: Sort[];
    readonly filters: Filter[];
    readonly loadingIndicator: boolean;

    readonly hasMoreData: boolean;

    // Observable data
    readonly rowsChanged: Observable<T[]>;

    // Public API

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

    /**
     * Starts populating data context by loading first
     * batch of data.
     */
    start(sorts?: Sort[], filters?: Filter[]): void;

    findByIndex(key: any): T | undefined;
}




export class DataContext<T> implements IDataContext<T> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    protected readonly logger: Logger = LoggerFactory.getLogger('DataContext');

    protected _total = 0;
    protected _loadingIndicator = false;

    private _sorts: Sort[] = [];
    private _filters: Filter[] = [];


    private _rows: T[] = [];
    private _dataChange = new BehaviorSubject<T[]>([]);
    private _primaryIndex = new Map<any, T>();

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        private listFetcher: (sorts: Sort[], filters: Filter[]) => Observable<Array<T>>,
        private _indexFn?: ((item: T) => any),
        private _localSort?: ((a: T, b: T) => number),
        private _localApply?: ((data: T[]) => T[])
    ) {
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public start(sorts?: Sort[], filters?: Filter[]): void {
        this._total = 0;
        this.rows = [];
        this.setSorts(sorts);
        this.setFilters(filters);
        this.loadData();
    }

    public get total(): number {
        return this._total;
    }

    public get sorts(): Sort[] {
        return this._sorts;
    }

    public get filters(): Filter[] {
        return this._filters;
    }

    public get loadingIndicator(): boolean {
        return this._loadingIndicator;
    }

    public get hasMoreData(): boolean { return false; }

    public loadMore(): Observable<any> {
        // NOP
        return Observable.empty();
    }

    public loadAll(sorts?: Sort[], filters?: Filter[]): void {
        this.start(sorts, filters);
    }

    public findByIndex(key: any): T | undefined {
        if (!this._indexFn) { throw new Error('findByIndex requires you to pass a index function!'); }
        return this._primaryIndex.get(key);
    }

    public get rowsChanged(): Observable<T[]> {
        return this._dataChange;
    }

    public get rows(): T[]{
        return this._rows;
    }

    public set rows(rows: T[]) {

        if (this._localApply) {
            rows = this._localApply(rows);
        }

        if (this._localSort) {
            this.logger.debug(`Apply local sort to ${rows.length} rows ...`);
            rows.sort(this._localSort);
        }

        this._rows = rows;
        this.logger.debug('data-context: Rows have changed: ' + this._rows.length);

        this._dataChange.next(this._rows);
    }

    // Private methods

    protected setSorts(sorts?: Sort[]) {
        this._sorts = sorts ? sorts.slice(0) : []; // clone
    }

    protected setFilters(filters?: Filter[]) {
        this._filters = filters ? filters.slice(0) : []; // clone
    }

    private updateIndex(): void {
        this._primaryIndex.clear();
        this.rows.forEach(item => this.indexItem(item));
    }

    protected indexItem(item: T): void {
        let key = this.getItemKey(item);
        if (key) {
            this._primaryIndex.set(key, item);
        }
    }

    private getItemKey(item: T): any  {
        if (this._indexFn) {
            return this._indexFn(item);
        }
        return null;
    }

    private loadData(): Observable<any> {

        const subject = new Subject();

        this._loadingIndicator = true;
        if (this.listFetcher) {
            this.listFetcher(this.sorts, this.filters)
                .take(1)
                .subscribe(
                    list => {
                        this._total = list.length;
                        this.rows = list;
                        this._loadingIndicator = false;
                        this.logger.debug('data-context: Got list data: ' + list.length);

                        subject.next();
                    }, err => {
                        this._total = 0;
                        this.rows = [];
                        this._loadingIndicator = false;
                        this.updateIndex();
                        this.logger.error('data-context: Failed to query data', err);

                        subject.error(err);
                    });
        }else {
            this.logger.warn('data-context: Skipping data context load - no list fetcher present!');
            subject.error(new Error('data-context: Skipping data context load - no list fetcher present!'));
        }

        return subject.take(1);
    }
}
