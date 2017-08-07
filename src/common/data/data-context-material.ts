

import {CollectionViewer, DataSource} from "@angular/cdk";
import {Observable} from "rxjs/Observable";
import {IDataContext} from "./data-context";
import {Filter} from "./filter";
import {Sort} from "./page";


/**
 * Adapter for a data-context for the Angular Material DataSource
 */
export class MaterialDataContext<T> extends DataSource<T> implements IDataContext<T> {

  constructor(
    private datacontext : IDataContext<T>){
    super();
    if(!datacontext) throw Error('datacontext must not be NULL!');
  }


  public connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.datacontext.rowsChanged;
  }

  public disconnect(collectionViewer: CollectionViewer): void {
  }

  get rows() : T[] { return this.datacontext.rows; }
  set rows(data: T[]) { this.datacontext.rows = data; }

  get total(): number { return this.datacontext.total; }

  get sorts(): Sort[] | undefined { return this.datacontext.sorts; }

  get filters(): Filter[] | undefined {return this.datacontext.filters; }

  get loadingIndicator(): boolean { return this.datacontext.loadingIndicator; }

  get rowsChanged() : Observable<T[]> { return this.datacontext.rowsChanged; }


  start(sorts?: Sort[], filters?: Filter[]): void {
    this.datacontext.start(sorts, filters);
  }

  findByIndex(key: any): T | undefined {
    return this.datacontext.findByIndex(key);
  }

  get hasMoreData() : boolean {
      return this.datacontext.hasMoreData;
  }

  loadMore(): void {
    this.datacontext.loadMore();
  }

}
