
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
import {DataContextActivePageLocal} from './data-context-active-page-local';
import {TokenChunkRequest} from '../token-chunk-request';
import {IDataContext, IDataContextActivePage, IDataContextContinuable} from './data-context';
import {RestClientContinuable, RestClientList, RestClientPaged} from '../rest/rest-client';
import {MatTableDataContextBindingBuilder} from './mat-table-data-context-binding';

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

  /***************************************************************************
   *                                                                         *
   * Builder                                                                 *
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

  public buildClient(
    restClient: RestClientList<T, any>
  ): IDataContext<T> {
    return this.build(
      (sorts, filters) => restClient.findAllFiltered(filters, sorts)
    );
  }

  public buildPagedClient(
    restClient: RestClientPaged<T, any>
  ): IDataContextContinuable<T> {
    return this.buildPaged(
      (pageable, filters) => restClient.findAllPaged(pageable, filters)
    );
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

  public buildContinuationTokenClient(
    restClient: RestClientContinuable<T, any>
  ): IDataContextContinuable<T> {
    return this.buildContinuationToken(
      (request) => restClient.findAllContinuable(request)
    );
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

  public buildActivePagedClient(
    restClient: RestClientPaged<T, any>
  ): IDataContextActivePage<T> {
    return this.buildActivePaged(
      (pageable, filters) => restClient.findAllPaged(pageable, filters)
    );
  }

  public buildLocalActivePaged(
    data: T[],
  ): IDataContextActivePage<T> {

    return this.wrap(new DataContextActivePageLocal<T>(
      data,
      this._pageSize,
      this._indexFn,
      this._localSort,
      this._localApply,
    ));
  }

  public buildStatic(items: T[]): IDataContext<T> {
    return this.wrap(
      new DataContextSimple<T>( (a, b) => of(items))
    );
  }

  public buildEmpty(): IDataContext<T> {
    return this.wrap(
      new DataContextSimple<T>( (a, b) => EMPTY)
    );
  }

  public buildEmptyContinuable(): IDataContextContinuable<T> {
    return this.wrap(new DataContextContinuablePaged<T>(
      (a, b) => EMPTY,
      this._pageSize,
      this._indexFn,
      this._localSort,
      this._localApply
    ));
  }

  public buildEmptyActivePaged(): IDataContextActivePage<T> {
    return this.wrap(new DataContextActivePage<T>(
      (a, b) => EMPTY,
      this._pageSize,
      this._indexFn,
      this._localSort,
      this._localApply,
    ));
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private wrap<DC extends IDataContext<T>>(dc: DC): DC {
    this.applyBindings(dc);
    return dc;
  }

  private applyBindings(dc: IDataContext<T>): void {
    this.matTableSupport.bind(dc);
  }
}
