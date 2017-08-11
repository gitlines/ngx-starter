import {
  Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild,
} from "@angular/core";
import {GlobalSearchService, SearchQuery, SortOption} from "./global-search.service";
import {NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {Sort} from "../../common/data/page";



@Component({
  selector: 'global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit, OnDestroy {

  private _searchCollapsed : boolean = true;
  private _txtSearch: ElementRef;
  private _subs : Subscription[] = [];

  @Output()
  public onSearchCollapsed = new EventEmitter<boolean>();

  public availableSort : SortOption[] = [];
  public selectedSort : SortOption = this.availableSort[0];
  public sortAsc : boolean = false;
  public globalSearchDisabled : boolean;

  constructor(
    private router : Router,
    private globalSearch : GlobalSearchService) {

    this.globalSearchDisabled = !globalSearch.showGlobalSearch;


    this._subs.push(

      globalSearch.showGlobalSearchObservable
        .subscribe(value => {
          this.globalSearchDisabled = !value;
        }),

      this.globalSearch.availableSortsObservable
        .subscribe(available => {
          this.availableSort = available;
        }),

      router.events
        .filter(event => event instanceof NavigationEnd)
        .subscribe(() => {
          this.searchCollapsed = true;
        })
    );

  }

  ngOnInit() {
    this.searchCollapsed = true;
  }


  ngOnDestroy(): void {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  @Input()
  get searchCollapsed() : boolean {
    return this._searchCollapsed;
  }

  @ViewChild('txtSearch')
  set txtSearch(input : ElementRef) {
    this._txtSearch = input;
  }

  set searchCollapsed(value : boolean){
    this._searchCollapsed = value;
    this.onSearchCollapsed.emit(this.searchCollapsed);
    if(!this._searchCollapsed){
      setTimeout(() => this._txtSearch.nativeElement.focus(), 0);
    }
  }

  get toggleIcon() : string {
    return this.searchCollapsed ? 'search' : 'close';
  }

  public toggleSearch(){
    if(this.searchCollapsed){
      // Show search
      this.searchCollapsed = false;
    }else{
      // Collapse search
      this.searchCollapsed = true;
      this.globalSearch.query = SearchQuery.Empty;
    }
  }

  public toggleSortAsc() : void {
    this.sortAsc = !this.sortAsc;
    this.onQueryChanged();
  }

  public sortBy(sort : SortOption){
    this.selectedSort = sort;
    this.onQueryChanged();
  }

  public onQueryChanged(){

    let sorts = this.selectedSort ? [this.convertToSort(this.selectedSort)] : [];

    let newQuery = new SearchQuery(
      this.keywordsValue,
      sorts
    );

    this.globalSearch.query = newQuery;
  }

  private convertToSort(sort  : SortOption) : Sort {
      return new Sort(sort.id, this.sortAsc ? 'asc' : 'desc');
  }

  private get keywordsValue() : string {
    if(this._txtSearch){
      let txtInput = this._txtSearch.nativeElement as HTMLInputElement;
      return txtInput.value;
    }
    return '';
  }

}
