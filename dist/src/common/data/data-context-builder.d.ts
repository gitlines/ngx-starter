import { IDataContext } from "./data-context";
import { Page, Pageable, Sort } from "./page";
import { Filter } from "./filter";
import { Observable } from "rxjs/Observable";
export declare class DataContextBuilder<T> {
    static start<T>(): DataContextBuilder<T>;
    private _indexFn?;
    private _localSort?;
    private _pageSize;
    private _materialSupport;
    indexBy(indexFn?: ((item: T) => any)): DataContextBuilder<T>;
    pageSize(size: number): DataContextBuilder<T>;
    /**
     * Adds support for Material DataSource to the resulting DataContext
     * @returns {DataContextBuilder<T>}
     */
    mdDataSource(): DataContextBuilder<T>;
    localSorted(localSort: (a: T, b: T) => number): DataContextBuilder<T>;
    build(listFetcher: (sorts: Sort[], filters?: Filter[]) => Observable<Array<T>>): IDataContext<T>;
    buildPaged(pageLoader: (pageable: Pageable, filters?: Filter[]) => Observable<Page<T>>): IDataContext<T>;
    buildEmpty(): IDataContext<T>;
    private applyProxies(context);
}
