import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild
} from '@angular/core';
import {
  MatTableDataContextBinding,
  MatTableDataContextBindingBuilder
} from '../../../common/data/data-context/mat-table-data-context-binding';
import {MatColumnDef, MatPaginator, MatRowDef, MatSort, MatTable} from '@angular/material';
import {IDataContext, IDataContextActivePage, IDataContextContinuable} from '../../../common/data/data-context/data-context';
import {SelectionModel} from '../../../common/selection/selection-model';
import {BehaviorSubject, combineLatest, Observable, of, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {CdkColumnDef, CdkRowDef, CdkTable} from '@angular/cdk/table';
import {DataContextBuilder} from '../../../common/data/data-context/data-context-builder';

@Component({
  selector: 'elder-table, ebs-table', // ebs-table is deprecated
  templateUrl: './elder-table.component.html',
  styleUrls: ['./elder-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElderTableComponent implements OnInit, OnDestroy, AfterContentInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderTableComponent');

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

  /**
   * Define if ebs-table should clean up the
   * data-context resources for you.
   *
   * In more advanced scenarios where you plan to reuse the same data-context
   * set this to false and release the resources yourself. (dataContext.close)
   */
  @Input()
  public cleanUp = true;

  public canLoadMore$: Observable<boolean>;
  public total$: Observable<string>;
  public allSelected$: Observable<boolean>;
  public someSelected$: Observable<boolean>;


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
    this.autoCleanUp();
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

    this.autoCleanUp();

    if (data instanceof Array) {
      this.dataContext = DataContextBuilder.start()
        .buildLocal(data); // Memory leak
      this.dataContext.start();
    } else {
      if (data) {
        this.dataContext = data;
      } else {
        this.dataContext = DataContextBuilder.start().buildEmpty();
      }
    }
  }

  public set dataContext(data: IDataContext<any>) {
    this._dataContext = data;
    this.updateTableBinding();

    this.total$ = this._dataContext.total.pipe(
      map(total => total ? total + ''  : '∞')
    );

    this.allSelected$ = combineLatest(this.selectionModel.selection, this.dataContext.data).pipe(
      map(([selection, currentData]) => selection.length >= currentData.length)
    );

    this.someSelected$ = combineLatest(this.selectionModel.selection, this.dataContext.data).pipe(
      map(([selection, currentData]) => selection.length > 0 && selection.length < currentData.length)
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
    return 'hasMoreData' in this._dataContext;
  }

  public get isActivePaged(): boolean {
    if (!this._dataContext) { return false; }
    return 'page' in this._dataContext;
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
  public get isAllSelectedSnapshot(): boolean {
    const numSelected = this.selectionModel.selectionSnapshot.length;
    const numRows = this.dataContext.snapshot.data.length;
    return numSelected >= numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public masterToggle(): void {
    this.isAllSelectedSnapshot ?
      this.selectionModel.clear() :
      this.selectionModel.select(...this.dataContext.snapshot.data);
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

  /**
   * Performs clean up of the current data context if auto clean up is enabled.
   */
  private autoCleanUp(): void {
    if (this.cleanUp && this.dataContext) {
      this.logger.debug('Releasing DataContext resources to prevent memory leak. [cleanUp]="true"');
      this.dataContext.close();
    }
  }

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
