
import {DataContextContinuablePaged} from './data-context-continuable-paged';
import {Page, Pageable} from '../page';
import {Filter} from '../filter';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {DataContextSimple} from './data-context-simple';
import {DataContextActivePage} from './data-context-active-page';
import {Sort} from '../sort';
import {ContinuableListing} from '../continuable-listing';
import {DataContextContinuableToken} from './data-context-continuable-token';
import {EMPTY, Observable, of} from 'rxjs';
import {MatPaginator, MatSort} from '@angular/material';
import {TokenChunkRequest} from '../token-chunk-request';
import {IDataContext, IDataContextActivePage, IDataContextContinuable} from './data-context';
import {RestClient, RestClientContinuable, RestClientList, RestClientPaged} from '../rest/rest-client';
import {MatTableDataContextBindingBuilder} from './mat-table-data-context-binding';
import {RestClientDataContextBinding} from './rest-client-data-context-binding';
import {LocalDataPageFetcher} from './local/local-data-page-fetcher';
import {LocalDataListFetcher} from './local/local-data-list-fetcher';

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
  private _reloadOnLocalChanges = false;

  private matTableSupport = MatTableDataContextBindingBuilder.start();

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
  public indexBy(indexFn?: ((item: T) => any)): this {
    this._indexFn = indexFn;
    return this;
  }

  /**
   * The desired size of a page/chunk when loading data.
   * Note that continuable apis might just take this as a wish or even completely ignore this param.
   */
  public pageSize(size: number): this {
    this._pageSize = size;
    return this;
  }

  /**
   * Adds support for Material DataSource to the resulting DataContextSimple
   * @deprecated This is no longer required as Material-DataContext is supported by default now
   */
  public mdDataSource(): this {
    return this;
  }

  /**
   * Sort the data context locally by the given sort function.
   *
   * Note that this might be a costly operation when there are a lot of elements present.
   * Prefer server side sorting if possible.
   */
  public localSorted(localSort: (a: T, b: T) => number): this {
    this._localSort = localSort;
    return this;
  }

  /**
   * Bind the data-context to the given reactive sort source.
   */
  public activeSortedMat(matSort: MatSort): this {
    this.matTableSupport.withSort(matSort);
    return this;
  }

  public activePagedMat(matPage: MatPaginator): this {
    this.matTableSupport.withPaginator(matPage);
    return this;
  }

  /**
   * For each element which is added to the datacontext, apply the given function.
   */
  public localApply(localApply?: ((data: T[]) => T[])): this {
    this._localApply = localApply;
    return this;
  }

  /**
   * On a local change event, automatically reload data in the data-context.
   * This means whenever there was an modify operation on the rest client,
   * such as Update, Delete or Create, the data will be reloaded.
   */
  public reloadOnLocalChanges(): this {
    this._reloadOnLocalChanges = true;
    return this;
  }

  /***************************************************************************
   *                                                                         *
   * Loading Builder                                                         *
   *                                                                         *
   **************************************************************************/

  public build( listFetcher: (sorts: Sort[], filters?: Filter[]) => Observable<Array<T>>): IDataContext<T> {
    return this.wrap(new DataContextSimple<T>(
      listFetcher,
      this._indexFn,
      this._localSort,
      this._localApply,
    ));
  }

  public buildPaged(
    pageLoader: (pageable: Pageable, filters?: Filter[]) => Observable<Page<T>>
  ): IDataContextContinuable<T> {

    return this.wrap(new DataContextContinuablePaged<T>(
      pageLoader,
      this._pageSize,
      this._indexFn,
      this._localSort,
      this._localApply,
    ));
  }

  public buildContinuationToken(
    nextChunkLoader: (tokenChunkRequest: TokenChunkRequest) => Observable<ContinuableListing<T>>
  ): IDataContextContinuable<T> {
    return this.wrap(new DataContextContinuableToken<T>(
      nextChunkLoader,
      this._pageSize,
      this._indexFn,
      this._localSort,
      this._localApply,
    ));
  }

  public buildActivePaged(
    pageLoader: ((pageable: Pageable, filters?: Filter[]) => Observable<Page<T>>)): IDataContextActivePage<T> {
    return this.wrap(new DataContextActivePage<T>(
      pageLoader,
      this._pageSize,
      this._indexFn,
      this._localSort,
      this._localApply,
    ));
  }

  /***************************************************************************
   *                                                                         *
   * Static Data Builder                                                     *
   *                                                                         *
   **************************************************************************/

  /**
   * @deprecated Switch to buildLocal()
   */
  public buildStatic(items: T[]): IDataContext<T> {
    return this.buildLocal(items);
  }

  public buildLocal(items: T[]): IDataContext<T> {
    const localDataListFetcher = LocalDataListFetcher.from(items);
    return this.build(
      (s, f) => localDataListFetcher.findAll(f, s)
    );
  }

  public buildLocalActivePaged(
    data: T[],
  ): IDataContextActivePage<T> {
    const localPageFetcher = LocalDataPageFetcher.from(data);
    return this.buildActivePaged(
      (p, f) => localPageFetcher.findAllPaged(p, f)
    );
  }

  /***************************************************************************
   *                                                                         *
   * Empty Data Builder                                                      *
   *                                                                         *
   **************************************************************************/


  public buildEmpty(): IDataContext<T> {
    return this.build(
      (a, b) => EMPTY
    );
  }

  public buildEmptyContinuable(): IDataContextContinuable<T> {
    return this.buildPaged(
      (a, b) => EMPTY
    );
  }

  public buildEmptyActivePaged(): IDataContextActivePage<T> {
    return this.buildActivePaged(
      (a, b) => EMPTY
    );
  }

  /***************************************************************************
   *                                                                         *
   * Rest Client Builder                                                     *
   *                                                                         *
   **************************************************************************/

  public buildClient(
    restClient: RestClientList<T, any>
  ): IDataContext<T> {
    return this.wrapClient(
      this.build((sorts, filters) => restClient.findAllFiltered(filters, sorts)),
      restClient
    );
  }

  public buildPagedClient(
    restClient: RestClientPaged<T, any>
  ): IDataContextContinuable<T> {
    return this.wrapClient(
      this.buildPaged((pageable, filters) => restClient.findAllPaged(pageable, filters)),
      restClient
    );
  }

  public buildContinuationTokenClient(
    restClient: RestClientContinuable<T, any>
  ): IDataContextContinuable<T> {
    return this.wrapClient(
      this.buildContinuationToken((request) => restClient.findAllContinuable(request)),
      restClient
    );
  }

  public buildActivePagedClient(
    restClient: RestClientPaged<T, any>
  ): IDataContextActivePage<T> {
    return this.wrapClient(
      this.buildActivePaged((pageable, filters) => restClient.findAllPaged(pageable, filters)),
      restClient
    );
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private wrap<DC extends IDataContext<T>>(dc: DC): DC {
    this.matTableSupport.bind(dc);
    return dc;
  }

  private wrapClient<DC extends IDataContext<T>>(dc: DC, restClient: RestClient<any, any>): DC {
    if (this._reloadOnLocalChanges) {
      const binding = new RestClientDataContextBinding(dc, restClient);
    }
    return dc;
  }

}
