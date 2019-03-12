import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {map, skip, startWith} from 'rxjs/operators';


/**
 * Provides a model of a selection.
 * Supports single and multi selection.
 *
 * Supports custom selection equality (default by object value)
 */
export class SelectionModel<T> {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private _multiple: boolean;
  private readonly _selectionMap = new Map<any, T>();
  private readonly _selection = new BehaviorSubject<T[]>([]);
  private readonly _keyGetter: ((item: T) => any);

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  /**
   * Creates a new SelectionModel
   *
   * @param multiple Support multi selection?
   * @param keyGetter value identity - default to value object equality.
   * @param initial the initial selection
   */
  constructor(
    multiple = false,
    initial?: T[],
    keyGetter: ((item: T) => any) = a => a,
  ) {
    this._multiple = multiple;
    this._keyGetter = keyGetter;
    if (initial) {
      this.replaceSelection(initial);
    }
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get changed(): Observable<T[]> {
    return this.selection.pipe(
        skip(1) // Skip the initial value
    );
  }

  public get selection(): Observable<T[]> {
    return this._selection.asObservable();
  }

  public get selectionSnapshot(): T[] {
    return this._selection.getValue();
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public clear(): void {
    this.replaceSelection([]);
  }

  public replaceSelection(newSelection: T[]): void {
    this._selectionMap.clear();
    this.select(...newSelection);
  }

  public select(...values: T[]): void {
    if (this.selectInternal(values)) {
      this.selectionChanged();
    }
  }

  public deselect(...values: T[]): void {

    let anyChange = false;

    values.forEach(value => {
      const key = this._keyGetter(value);
      if (this._selectionMap.delete(key)) {
        anyChange = true;
      }
    });

    if (anyChange) {
      this.selectionChanged();
    }
  }

  public toggle(value: T): void {
    if ( this.isSelected(value) ) {
      this.deselect(value);
    } else {
      this.select(value);
    }
  }

  public isSelected(value: T): boolean {
    const key = this._keyGetter(value);
    return this._selectionMap.has(key);
  }


  public observeSelection(value: T): Observable<boolean> {
    const key = this._keyGetter(value);
    return this._selection.pipe(
      map(selected => this._selectionMap.has(key)),
    );
  }

  public get count(): number {
    return this._selectionMap.size;
  }

  public get isEmpty(): boolean {
    return this._selectionMap.size === 0;
  }

  public get hasValue(): boolean {
    return this._selectionMap.size > 0;
  }

  public get hasSingleValue(): boolean {
    return this._selectionMap.size === 1;
  }

  public get hasMultipleValues(): boolean {
    return this._selectionMap.size > 1;
  }

  public get isMultipleSelection(): boolean {
    return this._multiple;
  }

  public set isMultipleSelection(multiple: boolean) {

    if (multiple !== this._multiple) {
      this._multiple = multiple;

      if (!this._multiple) {
        const selected = this.selectionSnapshot;
        if (selected.length > 1) {
          this.select(selected[0]);
        }
      }
    }

  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private selectionChanged(): void {
    this._selection.next(
      Array.from(this._selectionMap.values())
    );
  }

  private selectInternal(values: T[]): boolean {
    if (values && values.length > 0) {

      if (this._multiple) {
        // Multi selection
        values.forEach(value => {
          this._selectionMap.set(this._keyGetter(value), value);
        });
      } else {
        // Single selection
        this._selectionMap.clear();
        const single = values[0]; // Maybe last is better?
        this._selectionMap.set(this._keyGetter(single), single);
      }
      return true;
    }
    return false;
  }
}
