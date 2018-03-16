import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {IDataContext} from './data-context';
import {Filter} from './filter';
import {Sort} from './page';
import {Observable} from 'rxjs/Observable';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {DataContextStatus} from './data-context-status';


export abstract class DataContextBase<T> extends DataSource<T> implements IDataContext<T> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly baselog: Logger = LoggerFactory.getLogger('DataContextBase');

    private _total = 0;
    private _loadingIndicator = false;

    private _sorts: Sort[] = [];
    private _filters: Filter[] = [];


    private _rows: T[] = [];
    private _dataChange = new BehaviorSubject<T[]>([]);
    private _statusChanged = new ReplaySubject<DataContextStatus>(1);
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
        this.clear();
        this.setSorts(sorts);
        this.setFilters(filters);
        return this.loadData();
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

    public get rows(): T[] {
        return this._rows;
    }

    /***************************************************************************
     *                                                                         *
     * Protected methods                                                       *
     *                                                                         *
     **************************************************************************/

    protected setRows(rows: T[]) {

        if (this._localApply) {
            rows = this._localApply(rows);
        }

        if (this._localSort) {
            this.baselog.debug(`Apply local sort to ${rows.length} rows ...`);
            rows.sort(this._localSort);
        }

        this._rows = rows;
        this.baselog.debug('data-context: Rows have changed: ' + this._rows.length);

        this._dataChange.next(this._rows);
    }

    protected setTotal(total: number): void {
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

    protected clear() {
        this.setTotal(0);
        this.setRows([]);
        this.setLoadingIndicator(false);
        this.updateIndex();
    }

    protected updateIndex(): void {
        this._primaryIndex.clear();
        this.rows.forEach(item => this.indexItem(item));
    }

    protected indexItem(item: T): void {
        let key = this.getItemKey(item);
        if (key) {
            this._primaryIndex.set(key, item);
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
        this.onStatus(DataContextStatus.success());
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
