import { Observable } from "rxjs";
import { Filter } from "./filter";
import { Page, Pageable, Sort } from "./page";
import { DataContext } from "./data-context";
/**
 * Extends a simple flat list data-context with pagination support.
 *
 */
export declare class PagedDataContext<T> extends DataContext<T> {
    private pageLoader;
    private pageCache;
    private latestPage;
    offset: number;
    limit: number;
    constructor(pageLoader: (pageable: Pageable, filters?: Filter[]) => Observable<Page<T>>, pageSize: number, _indexFn?: ((item: T) => any), _localSort?: ((a: T, b: T) => number));
    /**
     * Resets the data-context to a new filter / sorting strategy.
     * All current data will be discarded.
     *
     * @param {Sort[]} sorts
     * @param {Filter[]} filters
     */
    start(sorts?: Sort[], filters?: Filter[]): void;
    /**
     * Load the next chunk of data.
     * Useful for infinite scroll like data flows.
     *
     */
    loadMore(): void;
    readonly hasMoreData: boolean;
    private fetchPage(pageIndex, pageSize);
    /**
     * Load the data from the given page into the current data context
     * @param {Page<T>} page
     */
    private populatePageData(page);
}
