import { CollectionViewer, DataSource } from "@angular/cdk";
import { Observable } from "rxjs/Observable";
import { IDataContext } from "./data-context";
import { Filter } from "./filter";
import { Sort } from "./page";
/**
 * Adapter for a data-context for the Angular Material DataSource
 */
export declare class MaterialDataContext<T> extends DataSource<T> implements IDataContext<T> {
    private datacontext;
    constructor(datacontext: IDataContext<T>);
    connect(collectionViewer: CollectionViewer): Observable<T[]>;
    disconnect(collectionViewer: CollectionViewer): void;
    rows: T[];
    readonly total: number;
    readonly sorts: Sort[] | undefined;
    readonly filters: Filter[] | undefined;
    readonly loadingIndicator: boolean;
    readonly rowsChanged: Observable<T[]>;
    start(sorts?: Sort[], filters?: Filter[]): void;
    findByIndex(key: any): T | undefined;
    readonly hasMoreData: boolean;
    loadMore(): void;
}
