import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren, Input,
  OnDestroy,
  QueryList,
  OnInit,
  Output,
  ViewChild, DoCheck
} from '@angular/core';
import {FilterContext} from '../../../common/data/filter-context';
import {
  MatTableDataContextBinding,
  MatTableDataContextBindingBuilder
} from '../../../common/data/data-context/mat-table-data-context-binding';
import {MatColumnDef, MatPaginator, MatRowDef, MatSort, MatTable} from '@angular/material';
import {IDataContext, IDataContextActivePage, IDataContextContinuable} from '../../../common/data/data-context/data-context';
import {SelectionModel} from '../../../common/selection/selection-model';
import {BehaviorSubject, combineLatest, Observable, of, Subject, Subscription} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {CdkColumnDef, CdkRowDef, CdkTable} from '@angular/cdk/table';
import {DataContextBuilder} from '../../../common/data/data-context/data-context-builder';

@Component({
  selector: 'ebs-table',
  templateUrl: './ebs-table.component.html',
  styleUrls: ['./ebs-table.component.scss']
})
export class EbsTableComponent implements OnInit, OnDestroy, AfterContentInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('EbsTableComponent');

  private readonly unsubscribe$ = new Subject();

  private readonly _itemClickSubject = new Subject();

  private _displayedColumns: string[] = null;
  private _selectionVisible = false;
  private _matTableBinding: MatTableDataContextBinding;

  private _currentColumnDefs: CdkColumnDef[] = [];
  private _currentRowDefs: CdkRowDef<any>[] = [];

  private _matPaginator: MatPaginator;

  /** Underlying data context. */
  private _dataContext: IDataContext<any>;

  /// Table

  public readonly displayedColumnsInner$ = new BehaviorSubject<string[]>([]);

  @ViewChild(MatTable)
  public matTable: CdkTable<any>;


  @ContentChild(MatSort)
  protected matSort: MatSort;

  @ContentChildren(MatColumnDef)
  public columnDefs: QueryList<CdkColumnDef>;

  @ContentChildren(MatRowDef)
  public rowDefs: QueryList<CdkRowDef<any>>;

  @Input()
  public idField = 'id';

  @Input()
  public pageSizeOptions = [5, 10, 15, 20, 30];

  public canLoadMore$: Observable<boolean>;
  public total$: Observable<string>;

  /** Underlying selection model. */
  public readonly selectionModel: SelectionModel<any> =
    new SelectionModel<any>(false, [], entity => entity ? entity[this.idField] : 0);

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor() { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {
    this.updateTableBinding();
  }

  public ngAfterContentInit(): void {

    // Register the normal column defs to the matTable
    this.updateColumnDefs(this.columnDefs.toArray());

    // Register any custom row definitions to the matTable
    this.updateRowDefs(this.rowDefs.toArray());

    this.columnDefs.changes.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(
      (columnDefs: QueryList<MatColumnDef>) => {
        this.updateColumnDefs(columnDefs.toArray());
        this.updateColumnsBase('columnDefs');
      }
    );

    this.rowDefs.changes.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(
      (rowDefs: QueryList<CdkRowDef<any>>) => {
        this.updateRowDefs(rowDefs.toArray());
        this.updateColumnsBase('rowDefs');
      }
    );

    if (this.matSort) {
      this.matSort.disableClear = true; // ?
    }

    this.updateColumnsBase('ngAfterContentInit');
  }

  public ngOnDestroy(): void {

    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this._matTableBinding) {
      this._matTableBinding.unsubscribe();
      this._matTableBinding = null;
    }
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  @ViewChild(MatPaginator)
  public set matPaginator(paginator: MatPaginator) {
    this._matPaginator = paginator;
    this.updateTableBinding();
  }

  public get matPaginator(): MatPaginator {
    return this._matPaginator;
  }

  @Input()
  public set data(data: Array<any> | IDataContext<any>) {
    if (data instanceof Array) {
      this.dataContext = DataContextBuilder.start()
        .buildLocal(data); // Memory leak
      this.dataContext.start();
    } else {
      this.dataContext = data;
    }
  }

  public set dataContext(data: IDataContext<any>) {
    this._dataContext = data;
    this.updateTableBinding();

    this.total$ = this._dataContext.total.pipe(
      map(total => total ? total + ''  : '∞')
    );

    if (this.isContinuable) {
      this.canLoadMore$ = combineLatest(data.loading, this.dataContinuable.hasMoreData).pipe(
        map(([loading, hasMoreData]) => !loading && hasMoreData)
      );
    } else {
      this.canLoadMore$ = of(false);
    }
  }

  public get dataContext(): IDataContext<any> {
    return this._dataContext;
  }

  public get dataActivePaged(): IDataContextActivePage<any> {
    return this._dataContext as IDataContextActivePage<any>;
  }

  public get dataContinuable(): IDataContextContinuable<any> {
    return this._dataContext as IDataContextContinuable<any>;
  }

  public get isContinuable(): boolean {
    if (!this._dataContext) { return false; }
    return 'hasMoreDataSnapshot' in this._dataContext;
  }

  public get isActivePaged(): boolean {
    if (!this._dataContext) { return false; }
    return 'index' in this._dataContext
        && 'size' in this._dataContext;
  }

  @Input()
  public set displayedColumns(displayedColumns: string[]) {
    this._displayedColumns = displayedColumns;
    this.updateColumnsBase('displayedColumns');
  }

  public get displayedColumns(): string[] {
    return this._displayedColumns;
  }

  /** Indicates if selection column is shown. */
  @Input()
  public set selectionVisible(visible: boolean) {
    this._selectionVisible = visible;
    this.updateColumnsBase('selectionVisible');
  }

  public get selectionVisible(): boolean {
    return this._selectionVisible;
  }

  @Output()
  public get itemClick(): Observable<any> {
    return this._itemClickSubject;
  }

  /***************************************************************************
   *                                                                         *
   * Selection                                                               *
   *                                                                         *
   **************************************************************************/

  @Input()
  public set selection(selection: any[]) {
    this.selectionModel.replaceSelection(selection);
  }

  @Output()
  public get selectionChange(): Observable<any[]> {
    return this.selectionModel.changed;
  }

  @Output()
  public get selectionSingleChange(): Observable<any> {
    return this.selectionModel.changed.pipe(
      map(selection => {
        if (selection.length > 0) {
          return selection[0];
        } else {
          return null;
        }
      })
    );
  }

  @Input()
  public set selectionMultiEnabled(enableMultiSelection: boolean) {
    if (this.selectionModel) {
      this.selectionModel.isMultipleSelection = enableMultiSelection;
    }
  }

  /** Whether the number of selected elements matches the totalSnapshot number of rows. */
  public get isAllSelected(): boolean {
    const numSelected = this.selectionModel.selected.length;
    const numRows = this.dataContext.snapshot.data.length;
    return numSelected >= numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public masterToggle(): void {
    this.isAllSelected ?
      this.selectionModel.clear() :
      this.dataContext.snapshot.data.forEach(row => this.selectionModel.select(row));
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public trackByFn(index: number, entity: any): number {
    return entity[this.idField];
  }

  public onItemClick(entity: any): void {
    this.selectionModel.toggle(entity);
    this._itemClickSubject.next(entity);
  }

  /***************************************************************************
   *                                                                         *
   * Private Methods                                                         *
   *                                                                         *
   **************************************************************************/

  private updateColumnDefs(columnDefs: CdkColumnDef[] = []): void {


    // remove columns not desired
    this._currentColumnDefs
      .filter(currentColumnDef => columnDefs.indexOf(currentColumnDef) === -1)
      .forEach(columnToRemove => this.matTable.removeColumnDef(columnToRemove));

    // add missing columns
    columnDefs
      .filter(desired => this._currentColumnDefs.indexOf(desired) === -1)
      .forEach(columnToAdd => this.matTable.addColumnDef(columnToAdd));

    // remember new state
    this._currentColumnDefs = columnDefs;
  }

  private updateRowDefs(rowDefs: CdkRowDef<any>[] = []): void {

    // remove columns not desired
    this._currentRowDefs
      .filter(currentRowDef => rowDefs.indexOf(currentRowDef) === -1)
      .forEach(rowToRemove => this.matTable.removeRowDef(rowToRemove));

    // add missing columns
    rowDefs
      .filter(desired => this._currentRowDefs.indexOf(desired) === -1)
      .forEach(rowToAdd => this.matTable.addRowDef(rowToAdd));

    // remember new state
    this._currentRowDefs = rowDefs;
  }

  private updateTableBinding(): void {

    if (this._matTableBinding) {
      this._matTableBinding.unsubscribe();
      this._matTableBinding = null;
    }

    if (this.dataContext) {
      this._matTableBinding = MatTableDataContextBindingBuilder.start()
        .withPaginator(this.matPaginator)
        .withSort(this.matSort)
        .bind(this.dataContext);
    }
  }

  private updateColumnsBase(cause: string): void {

    let columns = this.displayedColumns;

    if (!columns) {
      columns = [];
      // If the user did not define columns to display
      // Assume he wants all his own columns in given order
      if (this.columnDefs) {
        this.columnDefs.forEach(col => {
          columns.push(col.name);
        });
      }
    }

    if (this.selectionVisible) {
      columns = ['select', ...columns];
    }

    this.logger.debug('updateColumnsBase: cause ' + cause + ' updated!', columns);

    this.displayedColumnsInner$.next(columns);
  }
}
