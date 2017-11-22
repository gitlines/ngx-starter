
import {Observable} from 'rxjs';
import {Filter} from './filter';
import {Page, Pageable, Sort} from './page';
import {DataContext} from './data-context';
import {NGXLogger} from 'ngx-logger';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/take';



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

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    /**
     * Resets the data-context to a new filter / sorting strategy.
     * All current data will be discarded.
     *
     * @param {Sort[]} sorts
     * @param {Filter[]} filters
     */
    public start(sorts?: Sort[], filters?: Filter[]): Observable<any> {
        this.initContext(sorts, filters);
        return this.fetchPage(0, this._limit);
    }

    /**
     * Load the next chunk of data.
     * Useful for infinite scroll like data flows.
     *
     */
    public loadMore(): Observable<any> {
        if (this.hasMoreData) {
            this.logger.info('paged-data-context: Loading more...' + this._latestPage);

            if (this.loadingIndicator) { return Observable.empty(); }
            let nextPage = this._latestPage + 1;
            return this.fetchPage(nextPage, this._limit);
        } else {
            this.logger.debug('paged-data-context: Cannot load more data, since no more data available.');
            return Observable.empty();
        }
    }

    public loadAll(sorts?: Sort[], filters?: Filter[]): void {

        this.logger.debug('paged-data-context: Starting to load all data ...');

        // load first page
        this.start(sorts, filters)
            .subscribe(() => {
                this.logger.debug('paged-data-context: First page has been loaded. Loading remaining data ...');
                // load rest in a recursive manner
                this.loadAllRec()
            }, err => {
                this.logger.error('paged-data-context: Failed to load first page of load all procedure!', err);
            })
    }


    public get hasMoreData(): boolean {
        return this.total > this.rows.length;
    }

    /***************************************************************************
     *                                                                         *
     * Private Methods                                                         *
     *                                                                         *
     **************************************************************************/

    private initContext(sorts?: Sort[], filters?: Filter[]): void{
        this._total = 0;
        this.rows = [];
        this._pageCache = new Map();
        this._latestPage = 0;
        this.setSorts(sorts);
        this.setFilters(filters);
    }

    private loadAllRec(): void {

        this.loadMore()
            .subscribe(() => {
                this.logger.debug('paged-data-context: Loading more data finished. Latest page loaded: ' + this._latestPage);
                this.loadAllRec();
            }, err => {
                this.logger.error('paged-data-context: Loading all failed!', err);
            });

    }

    private fetchPage(pageIndex: number, pageSize: number): Observable<any> {

        const subject = new Subject();

        let pageRequest = new Pageable(pageIndex, pageSize, this.sorts);

        if (this._pageCache.has(pageIndex)) {
            // Page already loaded - skipping request!
            this.logger.trace('paged-data-context: Skipping fetching page since its already in page observable cache.');
            subject.next();
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

                subject.next();

            }, err => {

                this._loadingIndicator = false;
                this.logger.error('paged-data-context: Failed to query data', err);

                subject.error(err);
            });
        }

        return subject.take(1);
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
