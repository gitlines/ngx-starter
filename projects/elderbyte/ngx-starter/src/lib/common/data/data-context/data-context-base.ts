import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {Filter} from '../filter';
import {Sort} from '../sort';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {DataContextStatus} from './data-context-status';
import {BehaviorSubject, EMPTY, Observable, of, Subject} from 'rxjs';
import {FilterContext} from '../filter-context';
import {DataContextSnapshot, IDataContext} from './data-context';
import {catchError, debounceTime, filter, skipUntil, skipWhile, takeUntil} from 'rxjs/operators';
import {SortContext} from '../sort-context';


export abstract class DataContextBase<T> extends DataSource<T> implements IDataContext<T> {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly baselog: Logger = LoggerFactory.getLogger('DataContextBase');

  private readonly _filter = new FilterContext();
  private readonly _sort = new SortContext();

  private readonly _data = new BehaviorSubject<T[]>([]);
  private readonly _loading = new BehaviorSubject<boolean>(false);
  private readonly _total = new BehaviorSubject<number | undefined>(undefined);
  private readonly _status = new BehaviorSubject<DataContextStatus>(DataContextStatus.success());

  private readonly _primaryIndex = new Map<any, T>();

  protected readonly unsubscribe$ = new Subject<any>();
  protected started = false;

  private readonly _reloadQueue = new Subject<any>();

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

    this._filter.filters.pipe(
      filter(() => this.started),
      takeUntil(this.unsubscribe$)
    ).subscribe(
      filters => this.onFiltersChanged(filters)
    );

    this._sort.sorts.pipe(
      filter(() => this.started),
      takeUntil(this.unsubscribe$)
    ).subscribe(
      sorts => this.onSortsChanged(sorts)
    );

    this._reloadQueue.pipe(
      filter(() => this.started),
      debounceTime(50),
      takeUntil(this.unsubscribe$),
      catchError(err => {  // Dont die on errors
        this.baselog.error('Reload queue detected error, bad!', err);
        return EMPTY;
      })
    ).subscribe(() => this.reloadNow());
    // Maybe skipMap the real requests for auto abort pending (except for continuation / paged)
  }

  /***************************************************************************
   *                                                                         *
   * Public API Material DC                                                  *
   *                                                                         *
   **************************************************************************/

  public connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.data;
  }

  public disconnect(collectionViewer: CollectionViewer): void {
    // this.close(); Closing will destroy the DC
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get snapshot(): DataContextSnapshot<T> {
    return new DataContextSnapshot(
      this.dataSnapshot,
      this.isEmpty,
      this.loadingSnapshot,
      this.totalSnapshot,
      this.statusSnapshot
    );
  }


  public get total(): Observable<number | undefined> {
    return this._total.asObservable();
  }

  public get totalSnapshot(): number | undefined {
    return this._total.getValue();
  }

  public get sort(): SortContext {
    return this._sort;
  }

  public get filter(): FilterContext {
    return this._filter;
  }

  public get loading(): Observable<boolean> {
    return this._loading.asObservable();
  }

  public get loadingSnapshot(): boolean {
    return this._loading.getValue();
  }

  public get data(): Observable<T[]> {
    return this._data.asObservable();
  }

  public get dataSnapshot(): T[] {
    return this._data.getValue();
  }

  public get status(): Observable<DataContextStatus> {
    return this._status;
  }

  public get statusSnapshot(): DataContextStatus {
    return this._status.getValue();
  }

  public get isEmpty(): boolean {
    return this.dataSnapshot.length === 0;
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/


  public start(sorts?: Sort[], filters?: Filter[]): Observable<any> {

    this.baselog.debug('Starting fresh dataContext ...');

    this.started = false;

    this._sort.replaceSorts(sorts);
    this._filter.replaceFilters(filters);

    this.started = true;

    return this.reloadNow();
  }

  public reload(): void {
    this._reloadQueue.next();
  }

  public findByIndex(key: any): T | undefined {
    if (!this._indexFn) { throw new Error('findByIndex requires you to pass a index function!'); }
    return this._primaryIndex.get(key);
  }

  /**
   * Closes this DataContext and cleans up all used resources.
   */
  public close(): void {

    this.started = false;
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this._data.complete();
    this._loading.complete();
    this._total.complete();
    this._status.complete();

    this.clearAll();
    this.baselog.debug('DataContext has been closed and resources cleaned up!');
  }

  /***************************************************************************
   *                                                                         *
   * Protected methods                                                       *
   *                                                                         *
   **************************************************************************/

  protected reloadNow(): Observable<any> {
    return this.reloadInternal(); // TODO This should actually return the real (http) request
  }

  /**
   * Append the given rows to to existing ones.
   */
  protected appendData(additionalData: T[]): void {
    // We had previous chunks so append to current data.
    const newData = [...this.dataSnapshot];
    newData.push(...additionalData);
    this.indexAll(additionalData);
    this.setData(newData, true);
  }

  /**
   * Replaces the existing data with the new set.
   * @param newData The new data set.
   * @param alreadyIndexed The rows will be indexed unless they already have been.
   */
  protected setData(newData: T[], alreadyIndexed = false): void {

    if (this._localApply) {
      newData = this._localApply(newData);
    }

    if (!alreadyIndexed) {
      this.indexAll(newData);
    }

    const current = this.dataSnapshot;

    if (!(current.length === 0 && newData.length === 0)) {
      this.baselog.debug('Data has changed: ' + newData.length);
      this._data.next(newData);
    }
  }

  protected setTotal(total: number | undefined): void {
    this._total.next(total);
  }

  protected setLoading(loading: boolean): void {
    this._loading.next(loading);
  }

  /**
   * Clears the current data-context cached data.
   * State such as current sorting and filtersSnapshot are kept.
   */
  protected clearAll(silent = false): void {
    this.setLoading(false);
    this.clearIndex();

    if (!silent) {
      this.setTotal(0);
      this.setData([]);
      this.onSuccess();
    }
  }

  protected updateIndex(): void {
    this.clearIndex();
    this.indexAll(this.dataSnapshot);
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
   * Occurs when the sort has changed.
   */
  protected onSortsChanged(sorts: Sort[]): void {
    this.reload();
  }

  /**
   * Occurs when the filter has changed.
   */
  protected onFiltersChanged(filters: Filter[]): void {
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
    this._status.next(status);
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
   *
   * @returns The reload job.
   */
  protected abstract reloadInternal(): Observable<any>;

  private clearIndex(): void {
    this._primaryIndex.clear();
  }
}
