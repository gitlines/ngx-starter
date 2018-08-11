
import {EMPTY, Observable, Subject} from 'rxjs';
import {Filter} from '../filter';
import {Page, Pageable} from '../page';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {DataContextContinuableBase} from './data-context-continuable-base';
import {take} from 'rxjs/operators';
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

    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/


    constructor(
        private pageLoader: (pageable: Pageable, filters: Filter[]) => Observable<Page<T>>,
        pageSize: number,
        indexFn?: ((item: T) => any),
        localSort?: ((a: T, b: T) => number),
        localApply?: ((data: T[]) => T[]),
    ) {
        super(pageSize, indexFn, localSort, localApply);
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
        if (this.hasMoreData) {
            this.logger.info('Loading more...' + this._latestPage);

            if (this.loadingIndicator) { return EMPTY; }
            const nextPage = this._latestPage + 1;
            return this.fetchPage(nextPage, this.chunkSize);
        } else {
            this.logger.debug('Cannot load more data, since no more data available.');
            return EMPTY;
        }
    }

    public get hasMoreData(): boolean {
        if (this.total) {
            return this.total > this.rows.length;
        }
        return false;
    }

    /***************************************************************************
     *                                                                         *
     * Private Methods                                                         *
     *                                                                         *
     **************************************************************************/

    protected onChunkSizeChanged(newSize: number): void {
        this.reload();
    }

    protected reloadInternal(): Observable<any> {
        return this.fetchPage(0, this.chunkSize);
    }

    protected clearAll(): void {
        super.clearAll();
        this._pageCache = new Map();
        this._latestPage = 0;
    }

    private fetchPage(pageIndex: number, pageSize: number): Observable<any> {

        const subject = new Subject();

        const pageRequest = new Pageable(pageIndex, pageSize, this.sorts);

        if (this._pageCache.has(pageIndex)) {
            // Page already loaded - skipping request!
            this.logger.trace('Skipping fetching page since its already in page observable cache.');
            subject.next();
        } else {

            this.setLoadingIndicator(true);

            this.logger.debug(`Loading page ${pageIndex} using pageable:`, pageRequest);

            const pageObs = this.pageLoader(pageRequest, this.filters);

            this._pageCache.set(pageIndex, pageObs);

            pageObs.subscribe((page: Page<T>) => {


                this.logger.debug('Got page data:', page);

                this.populatePageData(page);

                if (this._latestPage < page.number) {
                    this._latestPage = page.number; // TODO This might cause that pages are skipped
                }

                this.setLoadingIndicator(false);

                subject.next();
                this.onSuccess();

            }, err => {
                this.onError(err);
                this.setLoadingIndicator(false);
                this.logger.error('Failed to query data', err);
                subject.error(err);
            });
        }

        return subject.pipe(take(1));
    }

    /**
     * Load the data from the given page into the current data context
     */
    private populatePageData(page: Page<T>): void {
        try {
            this.setTotal(page.totalElements);
            const start = page.number * page.size;

            const newRows = [...this.rows];
            for (let i = 0; i < page.content.length; i++) {
                const item = page.content[i];
                newRows[i + start] = item;
                this.indexItem(item);
            }
            this.setRows(newRows, true);
        } catch (err) {
            this.onError(err);
            this.logger.error('Failed to populate data with page', page, err);
        }
    }


}
