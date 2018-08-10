import {MatPaginator, MatSort} from '@angular/material';
import {IDataContext, IDataContextActivePage} from './data-context';
import {Subscription, Unsubscribable} from 'rxjs';


export class MatTableSupportBuilder {

  private _matSort: MatSort;
  private _matPaginator: MatPaginator;


  public withSort(matSort: MatSort): this {
    this._matSort = matSort;
    return this;
  }

  public withPaginator(matPaginator: MatPaginator): this {
    this._matPaginator = matPaginator;
    return this;
  }

  public bind(dataContext: IDataContext<any>): MatTableDataContextBinding {
    return new MatTableDataContextBinding(
      dataContext,
      this._matSort,
      this._matPaginator,
    );
  }

}

export class MatTableDataContextBinding implements Unsubscribable {


  private _subscriptions: Subscription[] = [];

  constructor(
    private _dataContext: IDataContext<any>,
    private _matSort: MatSort,
    private _matPaginator: MatPaginator
  ) {
    this.subscribe();

    this._dataContext.rowsChanged.subscribe(
      changed => {},
      err => {},
      () => this.unsubscribe()
    );
  }

  public unsubscribe(): void {
    this._subscriptions.forEach(s => s.unsubscribe());
    this._subscriptions = [];
  }

  private subscribe(): void {

    if (this._matSort) {
      this._subscriptions.push(
        this._matSort.sortChange.subscribe(
          sort => this._dataContext.sort = sort
        )
      );
    }

    if (this._matPaginator) {

      const pagedDataContext = this._dataContext as IDataContextActivePage<any>;

      if (pagedDataContext.page !== undefined) {
        this._subscriptions.push(
          this._matPaginator.page.subscribe(pageRequest => {
            pagedDataContext.page = pageRequest;
          })
        );
      }
    }

  }
}
