
import {Observable} from 'rxjs';
import {Filter} from './filter';
import {Page, Pageable, Sort} from './page';
import {DataContext} from './data-context';
import {NGXLogger} from 'ngx-logger';



/**
 * Extends a simple flat list data-context with pagination support.
 *
 */
export class PagedDataContext<T> extends DataContext<T> {

    private readonly _limit;

    private _pageCache: Map<number, Observable<Page<T>>> = new Map();
    private _latestPage = 0;



    constructor(
        logger: NGXLogger,
        private pageLoader: (pageable: Pageable, filters: Filter[]) => Observable<Page<T>>,
        pageSize: number,
        _indexFn?: ((item: T) => any),
        _localSort?: ((a: T, b: T) => number),
        _localApply?: ((data: T[]) => T[])) {
        super(logger, () => Observable.empty(), _indexFn, _localSort, _localApply);
        this._limit = pageSize;
    }

    /**
     * Resets the data-context to a new filter / sorting strategy.
     * All current data will be discarded.
     *
     * @param {Sort[]} sorts
     * @param {Filter[]} filters
     */
    public start(sorts?: Sort[], filters?: Filter[]) {
        this._total = 0;
        this.rows = [];
        this._pageCache = new Map();
        this._latestPage = 0;
        this.setSorts(sorts);
        this.setFilters(filters);
        this.fetchPage(0, this._limit);
    }

    /**
     * Load the next chunk of data.
     * Useful for infinite scroll like data flows.
     *
     */
    public loadMore(): void {
        if (this.hasMoreData) {
            this.logger.info('paged-data-context: Loading more...' + this._latestPage);

            if (this.loadingIndicator) { return; }
            let nextPage = this._latestPage + 1;
            this.fetchPage(nextPage, this._limit);
        }
    }


    public get hasMoreData(): boolean {
        return this.total > this.rows.length;
    }

    private fetchPage(pageIndex: number, pageSize: number): void {

        let pageRequest = new Pageable(pageIndex, pageSize, this.sorts);

        if (this._pageCache.has(pageIndex)) {
            // Page already loaded - skipping request!
        }else {

            this._loadingIndicator = true;

            this.logger.debug(`paged-data-context: loading page ${pageIndex} using pageable:`, pageRequest);

            let pageObs = this.pageLoader(pageRequest, this.filters);

            this._pageCache.set(pageIndex, pageObs);

            pageObs.subscribe((page: Page<T>) => {

                this.logger.debug('paged-data-context: Got page data:', page);

                this.populatePageData(page);

                if (this._latestPage < page.number) {
                    this._latestPage = page.number; // TODO This might cause that pages are skipped
                }

                this._loadingIndicator = false;
            }, err => {
                this._loadingIndicator = false;
                this.logger.error('paged-data-context: Failed to query data', err);
            });
        }
    }

    /**
     * Load the data from the given page into the current data context
     * @param {Page<T>} page
     */
    private populatePageData(page: Page<T>) {
        try {
            this._total = page.totalElements;
            const start = page.number * page.size;

            let newRows = [...this.rows];
            for (let i = 0; i < page.content.length; i++) {
                let item = page.content[i];
                newRows[i + start] = item;
                this.indexItem(item);
            }
            this.rows = newRows;
        }catch (err) {
            this.logger.error('Failed to populate data with page', page, err);
        }
    }


}
