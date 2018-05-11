import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {IDataContext} from './data-context';
import {Filter} from './filter';
import {Sort} from './sort';
import {Observable} from 'rxjs/Observable';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {DataContextStatus} from './data-context-status';


export abstract class DataContextBase<T> extends DataSource<T> implements IDataContext<T> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly baselog: Logger = LoggerFactory.getLogger('DataContextBase');

    private _total: number | undefined = undefined;
    private _loadingIndicator = false;

    private _sorts: Sort[] = [];
    private _filters: Filter[] = [];

    private _rows: T[] = [];
    private _dataChange = new BehaviorSubject<T[]>([]);
    private _statusChanged = new BehaviorSubject<DataContextStatus>(DataContextStatus.success());
    private _primaryIndex = new Map<any, T>();

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        private _indexFn?: ((item: T) => any),
        private _localSort?: ((a: T, b: T) => number),
        private _localApply?: ((data: T[]) => T[])
    ) {
        super();
    }

    /***************************************************************************
     *                                                                         *
     * Public API Material DC                                                  *
     *                                                                         *
     **************************************************************************/

    public connect(collectionViewer: CollectionViewer): Observable<T[]> {
        return this.rowsChanged;
    }

    public disconnect(collectionViewer: CollectionViewer): void {
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public start(sorts?: Sort[], filters?: Filter[]): Observable<any> {

        this.baselog.debug('Starting fresh dataContext ...');

        this.clear();
        this.setSorts(sorts);
        this.setFilters(filters);
        return this.loadData();
    }

    public get total(): number | undefined {
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

    public findByIndex(key: any): T | undefined {
        if (!this._indexFn) { throw new Error('findByIndex requires you to pass a index function!'); }
        return this._primaryIndex.get(key);
    }

    public get rowsChanged(): Observable<T[]> {
        return this._dataChange;
    }

    public get statusChanged(): Observable<DataContextStatus> {
        return this._statusChanged;
    }

    public get statusSnapshot(): DataContextStatus {
        return this._statusChanged.getValue();
    }

    public get rows(): T[] {
        return this._rows;
    }

    /***************************************************************************
     *                                                                         *
     * Protected methods                                                       *
     *                                                                         *
     **************************************************************************/

    /**
     * Append the given rows to to existing ones.
     */
    protected appendRows(additionalRows: T[]): void {
        // We had previous chunks so append to current data.
        let newRows = [...this.rows];
        newRows.push(...additionalRows);
        this.indexAll(additionalRows);
        this.setRows(newRows, true);
    }

    /**
     * Replaces the existing rows with the given ones.
     * @param rows The new rows.
     * @param alreadyIndexed The rows will be indexed unless they already have been.
     */
    protected setRows(rows: T[], alreadyIndexed = false): void {

        if (this._localApply) {
            rows = this._localApply(rows);
        }

        if (this._localSort) {
            this.baselog.debug(`Apply local sort to ${rows.length} rows ...`);
            rows.sort(this._localSort);
        }

        if (!alreadyIndexed) {
            this.indexAll(rows);
        }

        if (!(this._rows.length === 0 && rows.length === 0)) {
            this.baselog.debug('Rows have changed: ' + this._rows.length);
            this._rows = rows;
            this._dataChange.next(this._rows);
        }
    }

    protected setTotal(total: number | undefined): void {
        this._total = total;
    }

    protected setLoadingIndicator(loading: boolean): void {
        this._loadingIndicator = loading;
    }

    protected setSorts(sorts?: Sort[]) {
        this._sorts = sorts ? sorts.slice(0) : []; // clone
    }

    protected setFilters(filters?: Filter[]) {
        this._filters = filters ? filters.slice(0) : []; // clone
    }

    protected clear(): void {
        this.setTotal(0);
        this.setRows([]);
        this.setLoadingIndicator(false);
        this.updateIndex();
        this.onSuccess();
    }

    protected updateIndex(): void {
        this._primaryIndex.clear();
        this.indexAll(this.rows);
    }

    /**
     * Indexes the given item by key if there is an index function defined.
     */
    protected indexItem(item: T): void {
        let key = this.getItemKey(item);
        if (key) {
            this._primaryIndex.set(key, item);
        }
    }

    /**
     * Indexes all the given items by key if there is an index function defined.
     */
    protected indexAll(items: T[]): void {
        if (this._indexFn) {
            items.forEach(item => this.indexItem(item));
        }
    }

    protected getItemKey(item: T): any  {
        if (this._indexFn) {
            return this._indexFn(item);
        }
        return null;
    }

    protected onError(err: any) {
        this.onStatus(DataContextStatus.error(err));
    }

    protected onSuccess() {
        if (this.statusSnapshot.hasError) {
            this.onStatus(DataContextStatus.success());
        }
    }

    protected onStatus(status: DataContextStatus) {
        this._statusChanged.next(status);
    }

    /***************************************************************************
     *                                                                         *
     * Abstract methods                                                        *
     *                                                                         *
     **************************************************************************/

    protected abstract loadData(): Observable<any>;
}
