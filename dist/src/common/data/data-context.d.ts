import { Filter } from "./filter";
import { Observable } from "rxjs/Observable";
import { Sort } from "./page";
/**
 * Manages a set of data (rows) which are to be displayed in a UI Component.
 *
 */
export interface IDataContext<T> {
    rows: T[];
    readonly total: number;
    readonly sorts?: Sort[];
    readonly filters?: Filter[];
    readonly loadingIndicator: boolean;
    readonly hasMoreData: boolean;
    loadMore(): void;
    readonly rowsChanged: Observable<T[]>;
    start(sorts?: Sort[], filters?: Filter[]): void;
    findByIndex(key: any): T | undefined;
}
export declare class DataContext<T> implements IDataContext<T> {
    private listFetcher;
    private _indexFn;
    private _localSort;
    total: number;
    sorts?: Sort[];
    filters?: Filter[];
    loadingIndicator: boolean;
    private _rows;
    private _dataChange;
    private _primaryIndex;
    constructor(listFetcher: (sorts?: Sort[], filters?: Filter[]) => Observable<Array<T>>, _indexFn?: ((item: T) => any) | undefined, _localSort?: ((a: T, b: T) => number) | undefined);
    start(sorts?: Sort[], filters?: Filter[]): void;
    readonly hasMoreData: boolean;
    loadMore(): void;
    findByIndex(key: any): T | undefined;
    readonly rowsChanged: Observable<T[]>;
    rows: T[];
    private updateIndex();
    protected indexItem(item: T): void;
    private getItemKey(item);
    private loadData();
}
