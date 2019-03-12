import {MatPaginator, MatSort, PageEvent, SortDirection as MatSortDirection} from '@angular/material';
import {IDataContext, IDataContextActivePage} from './data-context';
import {Subject, Unsubscribable} from 'rxjs';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {map, takeUntil} from 'rxjs/operators';
import {Sort, SortDirection} from '../sort';


export class MatTableDataContextBindingBuilder {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('MatTableDataContextBindingBuilder');

  private _matSort: MatSort;
  private _matPaginator: MatPaginator;

  /***************************************************************************
   *                                                                         *
   * Static Builder                                                          *
   *                                                                         *
   **************************************************************************/

  public static start(): MatTableDataContextBindingBuilder {
    return new MatTableDataContextBindingBuilder();
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

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

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('MatTableDataContextBinding');
  private readonly unsubscribe$ = new Subject();

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private readonly _dataContext: IDataContext<any>,
    private readonly _matSort: MatSort | null,
    private readonly _matPaginator: MatPaginator | null
  ) {
    this.subscribe();

    this._dataContext.data.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(
      changed => {},
      err => {},
      () => this.unsubscribe()
    );
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public unsubscribe(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private subscribe(): void {

    if (this._matSort) {

      // From matSort to data-context
      this._matSort.sortChange
        .pipe(
          map((matSort) =>
            new Sort(
              matSort.active,
              this.fromMatDirection(matSort.direction)
            )
          ),
          takeUntil(this.unsubscribe$)
        )
        .subscribe(
          sort => this._dataContext.sort.updateSort(sort)
        );

      // From dataContext to matSort
      this._dataContext.sort.sorts.pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(sorts => {

        if (sorts.length >= 1) {
          // At least one sort active
          const sort = sorts[0];
          this.updateMatSort(sort);
        } else {
          // No sort active
          this.updateMatSort(Sort.NONE);
        }
      });

    }

    if (this._matPaginator) {

      const pagedDataContext = this._dataContext as IDataContextActivePage<any>;

      if (pagedDataContext.page !== undefined) {
        this._matPaginator.page.pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe((pageRequest: PageEvent) => {
          pagedDataContext.page = pageRequest;
        });
      } else {
        this.logger.warn('Can not bind the given paginator to the given data-context,' +
          ' as the datacontext does not support pagination!', this._dataContext);
      }
    }
  }

  private updateMatSort(sort: Sort): void {

    const active = sort.prop;
    const direction = this.toMatDirection(sort.dir);

    if (this._matSort.active !== active || this._matSort.direction !== direction) {

      // We do only update matSort when there was a real change

      this._matSort.active = active;
      this._matSort.direction = direction;
    }
  }

  private toMatDirection(direction: SortDirection): MatSortDirection {
    return direction;
  }

  private fromMatDirection(matSortDirection: MatSortDirection): SortDirection {
    return matSortDirection;
  }
}
