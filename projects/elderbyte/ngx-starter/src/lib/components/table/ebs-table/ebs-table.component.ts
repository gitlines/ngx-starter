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
import {Observable, Subject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {LoggerFactory} from '@elderbyte/ts-logger';

@Component({
  selector: 'ebs-table',
  templateUrl: './ebs-table.component.html',
  styleUrls: ['./ebs-table.component.scss']
})
export class EbsTableComponent implements OnInit, OnDestroy, DoCheck, AfterContentInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('EbsTableComponent');

  private readonly _itemClickSubject = new Subject();

  private _subs: Subscription[];

  private _filterContext: FilterContext;
  private _displayedColumns: string[] = null;
  private _selectionVisible = false;
  private _matTableBinding: MatTableDataContextBinding;

  private _currentColumnDefs: MatColumnDef[] = [];
  private _currentRowDefs: MatRowDef<any>[] = [];


  /// Table

  public displayedColumnsInner: string[] = [];

  @ViewChild(MatTable)
  public table: MatTable<any>;

  @ViewChild(MatPaginator)
  protected paginator: MatPaginator;

  @ContentChild(MatSort)
  protected sort: MatSort;

  @ContentChildren(MatColumnDef)
  public columnDefs: QueryList<MatColumnDef>;

  @ContentChildren(MatRowDef)
  public rowDefs: QueryList<MatRowDef<any>>;

  @Input()
  public idField = 'id';

  @Input()
  public pageSizeOptions = [5, 10, 15, 20, 30];

  /** Underlying data context. */
  private _data: IDataContext<any>;

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

    // Register the normal column defs to the table
    this.updateColumnDefs(this.columnDefs.toArray());

    // Register any custom row definitions to the table
    this.updateRowDefs(this.rowDefs.toArray());

    this._subs = [
      this.columnDefs.changes.subscribe(
        (columnDefs: QueryList<MatColumnDef>) => {
          this.updateColumnDefs(columnDefs.toArray());
          this.updateColumnsBase('columnDefs');
        }
      ),

      this.rowDefs.changes.subscribe(
        (rowDefs: QueryList<MatRowDef<any>>) => {
          this.updateRowDefs(rowDefs.toArray());
          this.updateColumnsBase('rowDefs');
        }
      )
    ];

    this.updateColumnsBase('ngAfterContentInit');
  }

  public ngDoCheck(): void {
    if (this.sort) {
      this.sort.disableClear = true;

      if (this.data) {
        this.sort.active = this.data.sort.prop;
        switch (this.data.sort.dir) {
          case 'asc':
            this.sort.direction = 'asc';
            break;
          case 'desc':
            this.sort.direction = 'desc';
            break;
          default:
            this.sort.direction = '';
            break;
        }
      } else {
        this.sort.active = null;
        this.sort.direction = '';
      }
    }
  }

  public ngOnDestroy(): void {

    this._subs.forEach(sub => sub.unsubscribe());

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

  @Input()
  public set data(data: IDataContext<any>) {
    this._data = data;
    this.updateTableBinding();
  }

  public get data(): IDataContext<any> {
    return this._data;
  }

  public get dataActivePaged(): IDataContextActivePage<any> {
    return this._data as IDataContextActivePage<any>;
  }

  public get dataContinuable(): IDataContextContinuable<any> {
    return this._data as IDataContextContinuable<any>;
  }

  public get isContinuable(): boolean {
    if (!this._data) { return false; }
    return 'hasMoreData' in this._data;
  }

  public get isActivePaged(): boolean {
    if (!this._data) { return false; }
    return 'pageIndex' in this._data
        && 'pageSize' in this._data;
  }

  @Input()
  public set displayedColumns(displayedColumns: string[]) {
    this._displayedColumns = displayedColumns;
    this.updateColumnsBase('displayedColumns');
  }

  public get displayedColumns(): string[] {
    return this._displayedColumns;
  }

  @Input()
  public set filterContext(context: FilterContext) {
    this._filterContext = context;
    this.applyFilterContext(context);
  }

  public get filterContext(): FilterContext {
    return this._filterContext;
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
    return this.selectionModel.onChange;
  }

  @Output()
  public get selectionSingleChange(): Observable<any> {
    return this.selectionModel.onChange.pipe(
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

  /** Whether the number of selected elements matches the total number of rows. */
  public get isAllSelected(): boolean {
    const numSelected = this.selectionModel.selected.length;
    const numRows = this.data.rows.length;
    return numSelected >= numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public masterToggle(): void {
    this.isAllSelected ?
      this.selectionModel.clear() :
      this.data.rows.forEach(row => this.selectionModel.select(row));
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public trackByFn(index: number, entity: any): number {
    return entity[this.idField];
  }

  protected applyFilterContext(context: FilterContext): void {
    if (this.data) {
      this.data.filterContext = context;
    }
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

  private updateColumnDefs(columnDefs: MatColumnDef[] = []): void {

    // remove columns not desired
    this._currentColumnDefs
      .filter(currentColumnDef => columnDefs.indexOf(currentColumnDef) === -1)
      .forEach(columnToRemove => this.table.removeColumnDef(columnToRemove));

    // add missing columns
    columnDefs
      .filter(desired => this._currentColumnDefs.indexOf(desired) === -1)
      .forEach(columnToAdd => this.table.addColumnDef(columnToAdd));

    // remember new state
    this._currentColumnDefs = columnDefs;
  }

  private updateRowDefs(rowDefs: MatRowDef<any>[] = []): void {

    // remove columns not desired
    this._currentRowDefs
      .filter(currentRowDef => rowDefs.indexOf(currentRowDef) === -1)
      .forEach(rowToRemove => this.table.removeRowDef(rowToRemove));

    // add missing columns
    rowDefs
      .filter(desired => this._currentRowDefs.indexOf(desired) === -1)
      .forEach(rowToAdd => this.table.addRowDef(rowToAdd));

    // remember new state
    this._currentRowDefs = rowDefs;
  }

  private updateTableBinding(): void {

    if (this._matTableBinding) {
      this._matTableBinding.unsubscribe();
      this._matTableBinding = null;
    }

    if (this.data) {
      this._matTableBinding = MatTableDataContextBindingBuilder.start()
        .withPaginator(this.paginator)
        .withSort(this.sort)
        .bind(this.data);
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

    this.displayedColumnsInner = columns;
  }
}
