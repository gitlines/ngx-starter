import {DataContextBase} from './data-context-base';
import {Page, Pageable, PageRequest} from '../page';
import {Filter} from '../filter';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {IDataContextActivePage} from './data-context';
import {Sort} from '../sort';



export class DataContextActivePage<T> extends DataContextBase<T> implements IDataContextActivePage<T> {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly actlogger: Logger = LoggerFactory.getLogger('DataContextActivePage');

  private readonly _page: BehaviorSubject<PageRequest>;

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
    this._page = new BehaviorSubject<PageRequest>(new PageRequest(0, pageSize));
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get page(): Observable<PageRequest> {
    return this._page.asObservable();
  }

  public get pageSnapshot(): PageRequest {
    return this._page.getValue();
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Set the current page index and reload.
   * @param pageIndex
   */
  public setActiveIndex(pageIndex: number) {
    this.setActivePage(new PageRequest(pageIndex, this.pageSnapshot.size));
  }

  /**
   * Sets the current page index / size and reload.
   */
  public setActivePage(request: PageRequest) {

    this.actlogger.trace('Setting page to ', request);

    if (!request) { throw new Error('Setting page PageRequest must not be null!'); }

    let hasChange = false;

    const page = this.pageSnapshot;

    if (page.index !== request.index) {
      hasChange = true;
    } else if (page.size !== request.size) {
      hasChange = true;
    }

    if (hasChange) {
      this._page.next(request);
      this.reload();
    }
  }

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
    this.setActiveIndex(0);
  }

  protected reloadInternal(): Observable<any> {

    if (this._activePageLoad) {
      // Cancel previous pending request
      this._activePageLoad.unsubscribe();
    }

    const subject = new Subject<any>();

    this.setLoading(true);
    const page = this.pageSnapshot;
    const pageRequest = new Pageable(page.index, page.size, this.sort.sortsSnapshot);


    this._activePageLoad = this.pageLoader(pageRequest, this.filter.filtersSnapshot)
      .pipe(first())
      .subscribe(
        success => {
          this.setLoading(false);
          this.setTotal(success.totalElements);
          this.setData(success.content);
          subject.next(success);
          this.onSuccess();
        }, err => {
          this.setLoading(false);
          this.setData([]);
          this.actlogger.error('Failed to query data', err);
          subject.error(err);
          this.onError(err);
        }, () => {
          this.setLoading(false);
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
  protected onSortsChanged(sorts: Sort[]): void {
    this.setActiveIndex(0);
    super.onSortsChanged(sorts);
  }

  /**
   * Occurs when the filtersSnapshot property has changed.
   */
  protected onFiltersChanged(filters: Filter[]): void {
    this.setActiveIndex(0);
    super.onFiltersChanged(filters);
  }
}

