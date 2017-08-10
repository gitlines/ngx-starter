import { ElementRef, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { GlobalSearchService, SortOption } from "./global-search.service";
import { Router } from "@angular/router";
export declare class GlobalSearchComponent implements OnInit, OnDestroy {
    private router;
    private globalSearch;
    private _searchCollapsed;
    private _txtSearch;
    private _subs;
    onSearchCollapsed: EventEmitter<boolean>;
    availableSort: SortOption[];
    selectedSort: SortOption;
    sortAsc: boolean;
    globalSearchDisabled: boolean;
    constructor(router: Router, globalSearch: GlobalSearchService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    searchCollapsed: boolean;
    txtSearch: ElementRef;
    readonly toggleIcon: string;
    toggleSearch(): void;
    toggleSortAsc(): void;
    sortBy(sort: SortOption): void;
    onQueryChanged(): void;
    private convertToSort(sort);
    private readonly keywordsValue;
}
