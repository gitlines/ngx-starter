
import {Observable} from 'rxjs';
import {Filter} from './filter';
import {Page, Pageable, Sort} from './page';
import {DataContext} from './data-context';



/**
 * Extends a simple flat list data-context with pagination support.
 *
 */
export class PagedDataContext<T> extends DataContext<T> {

  private pageCache: Map<number, Observable<Page<T>>> = new Map();
  private latestPage = 0;

  public offset = 0;
  public limit = 30;


  constructor(
    private pageLoader: (pageable: Pageable, filters?: Filter[]) => Observable<Page<T>>,
    pageSize: number,
    _indexFn?: ((item: T) => any),
    _localSort?: ((a: T, b: T) => number)) {
    super(() => Observable.empty(), _indexFn, _localSort);
    this.limit = pageSize;
  }

  /**
   * Resets the data-context to a new filter / sorting strategy.
   * All current data will be discarded.
   *
   * @param {Sort[]} sorts
   * @param {Filter[]} filters
   */
  public start(sorts?: Sort[], filters?: Filter[]) {
    this.total = 0;
    this.rows = [];
    this.pageCache = new Map();
    this.sorts = sorts;
    this.filters = filters;
    this.fetchPage(0, this.limit);
  }

  /**
   * Load the next chunk of data.
   * Useful for infinite scroll like data flows.
   *
   */
  public loadMore(): void {
    if (this.hasMoreData) {
      console.log('loading more...' + this.latestPage);

      if (this.loadingIndicator) { return; }
      let nextPage = this.latestPage + 1;
      this.fetchPage(nextPage, this.limit);
    }
  }


  public get hasMoreData(): boolean {
    return this.total > this.rows.length;
  }

    private fetchPage(pageIndex: number, pageSize: number): void {

        let pageRequest = new Pageable(pageIndex, pageSize, this.sorts);

        if (this.pageCache.has(pageIndex)) {
            // Page already loaded - skipping request!
        }else {

            this.loadingIndicator = true;

            console.log(`loading page ${pageIndex} using sort:`, this.sorts);

            let pageObs = this.pageLoader(pageRequest, this.filters);

            this.pageCache.set(pageIndex, pageObs);

            pageObs.subscribe((page: Page<T>) => {

                console.log('Got page data:', page);

                this.populatePageData(page);

                if (this.latestPage < page.number) {
                    this.latestPage = page.number; // TODO This might cause that pages are skipped
                }

                this.loadingIndicator = false;
            }, err => {
                this.loadingIndicator = false;
                console.error('Failed to query data', err);
            });
        }
    }

  /**
   * Load the data from the given page into the current data context
   * @param {Page<T>} page
   */
  private populatePageData(page: Page<T>) {
      try {
          this.total = page.totalElements;
          const start = page.number * page.size;

          let newRows = [...this.rows];
          for (let i = 0; i < page.content.length; i++) {
              let item = page.content[i];
              newRows[i + start] = item;
              this.indexItem(item);
          }
          this.rows = newRows;
      }catch (err) {
          console.error('Failed to populate data with page', page, err);
      }
  }


}
