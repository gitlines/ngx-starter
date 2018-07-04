import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Sort} from '../../common/data';
import {Subject, Observable} from 'rxjs';
import {filter, map, mergeMap} from 'rxjs/operators';



export class SortOption {
    constructor(
        public id: string,
        public name: string
    ) { }
}

/**
 * Represents the search query which the user has configured
 */
export class SearchQuery {

    public static Empty = new SearchQuery('', []);

    constructor(
        public keywords: string,
        public sorts: Sort[]
    ) { }
}

@Injectable()
export class GlobalSearchService {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private _showGlobalSearch = false;
    private _showGlobalSearchSubject = new Subject<boolean>();

    private _query: SearchQuery;
    private _querySubject = new Subject<SearchQuery>();
    private _availableSorts = new Subject<SortOption[]>();

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(router: Router) {

        router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => router.routerState.root),
            map(route => {
                while (route.firstChild) { route = route.firstChild; }
                return route;
            }),
            filter(route => route.outlet === 'primary'),
            mergeMap(route => route.data)
        )
            .subscribe(currentRouteData  => {
                let enableGlobalSearch = currentRouteData['enableGlobalSearch'];
                this.showGlobalSearch = enableGlobalSearch != null ? !!enableGlobalSearch : !!currentRouteData['showGlobalSearch'];
            });
    }

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/


    public get availableSortsObservable(): Observable<SortOption[]> {
        return this._availableSorts;
    }

    public set availableSorts(sorts: SortOption[]) {
        this._availableSorts.next(sorts);
    }

    public get queryObservable(): Observable<SearchQuery> {
        return this._querySubject;
    }

    public get query(): SearchQuery {
        return this._query;
    }

    public set query(value: SearchQuery) {
        this._query = value;
        this._querySubject.next(value);
    }

    public get showGlobalSearchObservable(): Observable<boolean> {
        return this._showGlobalSearchSubject;
    }

    public get showGlobalSearch() {
        return this._showGlobalSearch;
    }

    public set showGlobalSearch(value: boolean) {
        this._showGlobalSearch = value;
        this._showGlobalSearchSubject.next(value);
    }


}
