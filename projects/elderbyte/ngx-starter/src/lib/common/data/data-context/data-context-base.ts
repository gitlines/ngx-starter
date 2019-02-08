import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {Filter} from '../filter';
import {Sort} from '../sort';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {DataContextStatus} from './data-context-status';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {FilterContext} from '../filter-context';
import {IDataContext} from './data-context';


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
  private _filterContext: FilterContext;
  private _filterContextSub: Subscription;

  private _rows: T[] = [];
  private readonly _dataChange = new BehaviorSubject<T[]>([]);
  private readonly _statusChanged = new BehaviorSubject<DataContextStatus>(DataContextStatus.success());
  private readonly _primaryIndex = new Map<any, T>();

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  protected constructor(
    private _indexFn?: ((item: T) => any),
    private _localApply?: ((data: T[]) => T[])
  ) {
    super();
    this.filterContext = new FilterContext();
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
    // this.close(); Closing will destroy the DC
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get total(): number | undefined {
    return this._total;
  }

  public get sorts(): Sort[] {
    return this._sorts;
  }

  public set sorts(newSorts: Sort[]) {
    this.setSorts(newSorts);
  }

  public set sort(sort: Sort) {
    if (
      this.sorts.length === 1
      && sort && this.sorts[0]
      && this.sorts[0].equals(sort)) {
      return;
    }
    this.setSorts(sort ? [sort] : []);
  }

  public get sort(): Sort {
    if (this.sorts.length > 0) {
      return this.sorts[0];
    } else {
      return Sort.NONE;
    }
  }

  public get filters(): Filter[] {
    return this._filterContext.filters;
  }

  public get filterContext(): FilterContext {
    return this._filterContext;
  }

  public set filterContext(context: FilterContext) {

    if (this._filterContextSub) { this._filterContextSub.unsubscribe(); }

    this._filterContext = context;

    if (context) {
      this._filterContextSub = this._filterContext.filtersChanged.subscribe(
        () => this.onFiltersChanged()
      );
    }
  }

  public get loadingIndicator(): boolean {
    return this._loadingIndicator;
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

  public get isEmpty(): boolean {
    return this._rows.length === 0;
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public start(sorts?: Sort[], filters?: Filter[]): Observable<any> {

    this.baselog.debug('Starting fresh dataContext ...');

    this.setSorts(sorts, true);
    this._filterContext.replaceFiltersWith(filters, true);
    return this.reload();
  }

  public reload(): Observable<any> {
    return this.reloadInternal();
  }

  public findByIndex(key: any): T | undefined {
    if (!this._indexFn) { throw new Error('findByIndex requires you to pass a index function!'); }
    return this._primaryIndex.get(key);
  }

  public close(): void {
    if (this._filterContextSub) { this._filterContextSub.unsubscribe(); }
    this._dataChange.complete();
    this.clearAll();
    this.baselog.debug('DataContext has been closed!');
  }

  /***************************************************************************
   *                                                                         *
   * Protected methods                                                       *
   *                                                                         *
   **************************************************************************/

  protected setSorts(sorts?: Sort[], skipEvent = false): void {
    this._sorts = sorts ? sorts.slice(0) : []; // clone
    if (!skipEvent) {
      this.onSortsChanged();
    }
  }

  /**
   * Append the given rows to to existing ones.
   */
  protected appendRows(additionalRows: T[]): void {
    // We had previous chunks so append to current data.
    const newRows = [...this.rows];
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

  /**
   * Clears the current data-context cached data.
   * State such as current sorting and filters are kept.
   */
  protected clearAll(silent = false): void {
    this.setLoadingIndicator(false);
    this.clearIndex();

    if (!silent) {
      this.setTotal(0);
      this.setRows([]);
      this.onSuccess();
    }
  }

  protected updateIndex(): void {
    this.clearIndex();
    this.indexAll(this.rows);
  }

  /**
   * Indexes the given item by key if there is an index function defined.
   */
  protected indexItem(item: T): void {
    const key = this.getItemKey(item);
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

  /***************************************************************************
   *                                                                         *
   * Event handler                                                           *
   *                                                                         *
   **************************************************************************/

  /**
   * Occurs when the sorts property has changed.
   */
  protected onSortsChanged(): void {
    this.reload();
  }

  /**
   * Occurs when the filters property has changed.
   */
  protected onFiltersChanged(): void {
    this.reload();
  }

  protected onError(err: any): void {
    this.onStatus(DataContextStatus.error(err));
  }

  protected onSuccess(): void {
    if (this.statusSnapshot.hasError) {
      this.onStatus(DataContextStatus.success());
    }
  }

  protected onStatus(status: DataContextStatus): void {
    this._statusChanged.next(status);
  }

  /***************************************************************************
   *                                                                         *
   * Abstract methods                                                        *
   *                                                                         *
   **************************************************************************/

  /**
   * Subclasses must implement this method and
   * reload the currently held data.
   * If possible, the current view state should be kept.
   */
  protected abstract reloadInternal(): Observable<any>;

  private clearIndex(): void {
    this._primaryIndex.clear();
  }
}
