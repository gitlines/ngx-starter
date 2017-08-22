
import {Filter} from './filter';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Sort} from './page';


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

  loadMore(): void;



  // Public API

  start(sorts?: Sort[], filters?: Filter[]): void;

  findByIndex(key: any): T | undefined;
}




export class DataContext<T> implements IDataContext<T> {


  protected _total = 0;
  protected _loadingIndicator = false;

  private _sorts: Sort[] = [];
  private _filters: Filter[] = [];


  private _rows: T[] = [];
  private _dataChange = new BehaviorSubject<T[]>([]);
  private _primaryIndex = new Map<any, T>();

  constructor(
    private listFetcher: (sorts: Sort[], filters: Filter[]) => Observable<Array<T>>,
    private _indexFn?: ((item: T) => any),
    private _localSort?: ((a: T, b: T) => number)
  ) {
  }

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

  public loadMore(): void {
    // NOP
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

    if (this._localSort) {
      console.log(`Apply local sort to ${rows.length} rows ...`);
      rows.sort(this._localSort);
    }

    this._rows = rows;

    console.info('rows changed data-change: ' + this._rows.length);

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

  private loadData() {
    this._loadingIndicator = true;
    if (this.listFetcher) {
      this.listFetcher(this.sorts, this.filters)
        .take(1)
        .subscribe(
          list => {
            this._total = list.length;
            this.rows = list;
            this._loadingIndicator = false;
            console.log('got list data!');
          }, err => {
            this._total = 0;
            this.rows = [];
            this._loadingIndicator = false;
            this.updateIndex();
            console.error('Failed to query data', err);
          });
    }else {
      console.warn('Skipping data context load - no list fetcher present!');
    }
  }
}
