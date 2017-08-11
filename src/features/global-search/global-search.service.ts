import {Injectable} from "@angular/core";
import {Subject, Observable} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Sort} from "../../common/data/page";



export class SortOption {
  constructor(
    public id : string,
    public name : string
  ){}
}

/**
 * Represents the search query which the user has configured
 */
export class SearchQuery {

  public static Empty = new SearchQuery('', []);

  constructor(
    public keywords : string,
    public sorts : Sort[]
  ){}
}

@Injectable()
export class GlobalSearchService {

  private _showGlobalSearch : boolean = false;
  private _showGlobalSearchSubject = new Subject<boolean>();

  private _query : SearchQuery;
  private _querySubject = new Subject<SearchQuery>();
  private _availableSorts = new BehaviorSubject<SortOption[]>([]);


  constructor(router : Router) {

     router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => router.routerState.root)
      .map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe(currentRouteData  => {

        //console.log('NavigationEnd:', currentRouteData);
        //console.log('show global search: ' + !!currentRouteData['showGlobalSearch']);

        this.showGlobalSearch = !!currentRouteData['showGlobalSearch'];
    });
  }

  get availableSortsObservable() : Observable<SortOption[]> {
    return this._availableSorts;
  }

  public set availableSorts(sorts : SortOption[]){
    this._availableSorts.next(sorts);
  }

  get queryObservable() : Observable<SearchQuery> {
    return this._querySubject;
  }

  get query() : SearchQuery{
    return this._query;
  }

  set query(value : SearchQuery){
    this._query = value;
    this._querySubject.next(value);
  }

  get showGlobalSearchObservable() : Observable<boolean> {
    return this._showGlobalSearchSubject;
  }

  get showGlobalSearch(){
    return this._showGlobalSearch;
  }

  set showGlobalSearch(value : boolean){
    this._showGlobalSearch = value;
    this._showGlobalSearchSubject.next(value);
  }


}
