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
import {IDataContextActivePage} from '../../../common/data/data-context/data-context';
import {SelectionModel} from '../../../common/selection/selection-model';
import {Observable, Subject} from 'rxjs';
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

  private _filterContext: FilterContext;
  private _displayedColumns: string[] = null;
  private _selectionVisible = false;
  private _matTableBinding: MatTableDataContextBinding;

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
  private _data: IDataContextActivePage<any>;

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
    this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));

    // Register any custom row definitions to the table
    this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));

    this.updateColumnsBase();
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

    if (this._matTableBinding) {
      this._matTableBinding.unsubscribe();
      this._matTableBinding = null;
    }

    if (this.data) {
      this.data.close();
    }
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  @Input()
  public set data(data: IDataContextActivePage<any>) {
    this._data = data;
    this.updateTableBinding();
  }

  public get data(): IDataContextActivePage<any> {
    return this._data;
  }

  @Input()
  public set displayedColumns(displayedColumns: string[]) {
    this._displayedColumns = displayedColumns;
    this.updateColumnsBase();
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
    this.updateColumnsBase();
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

  private updateColumnsBase(): void {

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

    this.displayedColumnsInner = columns;
  }
}
