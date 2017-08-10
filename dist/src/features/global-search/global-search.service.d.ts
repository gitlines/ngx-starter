import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { Sort } from "../../common/data/page";
export declare class SortOption {
    id: string;
    name: string;
    constructor(id: string, name: string);
}
/**
 * Represents the search query which the user has configured
 */
export declare class SearchQuery {
    keywords: string;
    sorts: Sort[];
    static Empty: SearchQuery;
    constructor(keywords: string, sorts: Sort[]);
}
export declare class GlobalSearchService {
    private _showGlobalSearch;
    private _showGlobalSearchSubject;
    private _query;
    private _querySubject;
    private _availableSorts;
    constructor(router: Router);
    readonly availableSortsObservable: Observable<SortOption[]>;
    availableSorts: SortOption[];
    readonly queryObservable: Observable<SearchQuery>;
    query: SearchQuery;
    readonly showGlobalSearchObservable: Observable<boolean>;
    showGlobalSearch: boolean;
}
