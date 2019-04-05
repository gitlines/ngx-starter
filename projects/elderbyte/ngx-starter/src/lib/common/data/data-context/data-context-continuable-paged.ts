
import {combineLatest, EMPTY, Observable, Subject} from 'rxjs';
import {Filter} from '../filter';
import {Page, Pageable} from '../page';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {DataContextContinuableBase} from './data-context-continuable-base';
import {first, map, take, takeUntil} from 'rxjs/operators';
import {Sort} from '../sort';

/**
 * Extends a simple flat list data-context with infinite-scroll pagination support.
 *
 */
export class DataContextContinuablePaged<T> extends DataContextContinuableBase<T> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger: Logger = LoggerFactory.getLogger('DataContextContinuablePaged');

    private _pageCache: Map<number, Observable<Page<T>>> = new Map();
    private _latestPage = 0;

    private readonly _hasMoreData: Observable<boolean>;

    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/

    constructor(
        private pageLoader: (pageable: Pageable, filters: Filter[]) => Observable<Page<T>>,
        pageSize: number,
        indexFn: ((item: T) => any),
        localApply: ((data: T[]) => T[]),
        localSort: ((data: T[], sorts: Sort[]) => T[])
    ) {
        super(pageSize, indexFn, localApply, localSort);

        this._hasMoreData = combineLatest(this.total, this.data).pipe(
          map(([total, data]) => this.checkHasMoreData(total, data)),
          takeUntil(this.unsubscribe$)
        );
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    /**
     * Load the next chunk of data.
     * Useful for infinite scroll like data flows.
     *
     */
    public loadMore(): Observable<any> {
        if (this.hasMoreDataSnapshot) {
            this.logger.info('Loading more...' + this._latestPage);

            if (this.loadingSnapshot) { return EMPTY; }
            const nextPage = this._latestPage + 1;
            return this.fetchPage(nextPage, this.chunkSize);
        } else {
            this.logger.debug('Cannot load more data, since no more data available.');
            return EMPTY;
        }
    }

    public get hasMoreData(): Observable<boolean> {
      return this._hasMoreData;
    }

    public get hasMoreDataSnapshot(): boolean {
        return this.checkHasMoreData(this.totalSnapshot, this.dataSnapshot);
    }

    /***************************************************************************
     *                                                                         *
     * Private Methods                                                         *
     *                                                                         *
     **************************************************************************/

    private checkHasMoreData(total: number | undefined, data: T[]): boolean {
      if (total) {
        return total > data.length;
      }
      return false;
    }

    protected onChunkSizeChanged(newSize: number): void {
        this.reload();
    }

    protected reloadInternal(): Observable<any> {

      // Since continuable data-contexts are appending data,
      // we need to clear it for a reload.
      this.clearAll(true);

      return this.fetchPage(0, this.chunkSize, true);
    }

    protected clearAll(silent = false): void {
        super.clearAll(silent);
        this._pageCache = new Map();
        this._latestPage = 0;
    }

    private fetchPage(pageIndex: number, pageSize: number, clear = false): Observable<any> {

        const subject = new Subject();

        const pageRequest = new Pageable(pageIndex, pageSize, this.sort.sortsSnapshot);

        if (this._pageCache.has(pageIndex)) {
            // Page already loaded - skipping request!
            this.logger.trace('Skipping fetching page since its already in page observable cache.');
            subject.next();
        } else {

            this.setLoading(true);

            this.logger.debug(`Loading page ${pageIndex} using pageable:`, pageRequest);

            const pageObs = this.pageLoader(pageRequest, this.filter.filtersSnapshot);

            this._pageCache.set(pageIndex, pageObs);

            pageObs.subscribe((page: Page<T>) => {


                this.logger.debug('Got page data:', page);

                this.populatePageData(page, clear);

                if (this._latestPage < page.number) {
                    this._latestPage = page.number; // TODO This might cause that pages are skipped
                }

                this.setLoading(false);

                subject.next();
                this.onSuccess();

            }, err => {
                this.onError(err);
                this.setData([]);
                this.setTotal(0);
                this.setLoading(false);
                this.logger.error('Failed to query data', err);
                subject.error(err);
            });
        }

        return subject.pipe(first());
    }

    /**
     * Load the data from the given page into the current data context
     */
    private populatePageData(page: Page<T>, clear: boolean): void {
        try {
            this.setTotal(page.totalElements);
            const start = page.number * page.size;

            const newData = clear ? [] : [...this.dataSnapshot];
            for (let i = 0; i < page.content.length; i++) {
                const item = page.content[i];
                newData[i + start] = item;
                this.indexItem(item);
            }
            this.setData(newData, true);
        } catch (err) {
            this.onError(err);
            this.logger.error('Failed to populate data with page', page, err);
        }
    }


}
