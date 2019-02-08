import {DataContextBase} from './data-context-base';
import {Page, Pageable, PageRequest} from '../page';
import {Filter} from '../filter';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {Observable, Subject, Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {IDataContextActivePage} from './data-context';



export class DataContextActivePage<T> extends DataContextBase<T> implements IDataContextActivePage<T> {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly actlogger: Logger = LoggerFactory.getLogger('DataContextActivePage');

  private _page: PageRequest;

  /**
   * Subscription to the event when the active page has changed.
   * This will trigger a page reload.
   */
  private _activePageChangedSub: Subscription;

  /**
   * Subscription of an actual page load http request.
   * If this is closed, it will cancel the http request.
   */
  private _activePageLoad: Subscription;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/


  constructor(
    private pageLoader: (pageable: Pageable, filters: Filter[]) => Observable<Page<T>>,
    pageSize: number,
    indexFn?: ((item: T) => any),
    localApply?: ((data: T[]) => T[])
  ) {

    super(indexFn, localApply);

    this._page = {
      pageSize: pageSize,
      pageIndex: 0
    };
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get pageIndex(): number {
    return this._page.pageIndex;
  }

  public set pageIndex(index: number) {
    this.page = {
      pageSize: this.pageSize,
      pageIndex: index
    };
  }

  public get pageSize(): number {
    return this._page.pageSize;
  }

  public set pageSize(size: number) {
    this.page = {
      pageSize: size,
      pageIndex: this.pageIndex
    };
  }

  /**
   * Sets the current page index / size.
   */
  public set page(request: PageRequest) {

    this.actlogger.trace('Setting page to ', request);

    if (!request) { throw new Error('Setting page PageRequest must not be null!'); }

    let hasChange = false;

    if (this._page.pageIndex !== request.pageIndex) {
      hasChange = true;
    } else if (this._page.pageSize !== request.pageSize) {
      hasChange = true;
    }

    if (hasChange) {
      this._page = request;
      this.reload();
    }
  }

  public get page(): PageRequest {
    return this._page;
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/


  public close(): void {
    super.close();
    if (this._activePageChangedSub) {
      this._activePageChangedSub.unsubscribe();
    }
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  protected clearAll(): void {
    super.clearAll();
    this.pageIndex = 0;
  }

  protected reloadInternal(): Observable<any> {

    if (this._activePageLoad) {
      // Cancel previous pending request
      this._activePageLoad.unsubscribe();
    }

    const subject = new Subject<any>();

    this.setLoadingIndicator(true);
    const pageRequest = new Pageable(this.pageIndex, this.pageSize, this.sorts);


    this._activePageLoad = this.pageLoader(pageRequest, this.filters)
      .pipe(first())
      .subscribe(
        success => {
          this.setLoadingIndicator(false);
          this.setTotal(success.totalElements);
          this.setRows(success.content);
          subject.next(success);
          this.onSuccess();
        }, err => {
          this.setLoadingIndicator(false);
          this.setRows([]);
          this.actlogger.error('Failed to query data', err);
          subject.error(err);
          this.onError(err);
        }, () => {
          this.setLoadingIndicator(false);
        });

    return subject.pipe(first());
  }

  /***************************************************************************
   *                                                                         *
   * Event handlers                                                          *
   *                                                                         *
   **************************************************************************/

  /**
   * Occurs when the sorts property has changed.
   */
  protected onSortsChanged(): void {
    this.pageIndex = 0;
    super.onSortsChanged();
  }

  /**
   * Occurs when the filters property has changed.
   */
  protected onFiltersChanged(): void {
    this.pageIndex = 0;
    super.onFiltersChanged();
  }
}

