import {Observable, Subject} from 'rxjs';


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
  private readonly _selection = new Map<any, T>();
  private readonly _selectionSubject = new Subject<T[]>();
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

  /**
   * @deprecated Please use the new 'changed' property
   */
  public get onChange(): Observable<T[]> {
    return this.changed;
  }

  public get changed(): Observable<T[]> {
    return this._selectionSubject.asObservable();
  }

  public get selected(): T[] {
    return Array.from(this._selection.values());
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
    this._selection.clear();
    this.selectInternal(newSelection);
    this.selectionChanged();
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
      if (this._selection.delete(key)) {
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
    return this._selection.has(key);
  }

  public get count(): number {
    return this._selection.size;
  }

  public get isEmpty(): boolean {
    return this._selection.size === 0;
  }

  public get hasValue(): boolean {
    return this._selection.size > 0;
  }

  public get hasSingleValue(): boolean {
    return this._selection.size === 1;
  }

  public get hasMultipleValues(): boolean {
    return this._selection.size > 1;
  }

  public get isMultipleSelection(): boolean {
    return this._multiple;
  }

  public set isMultipleSelection(multiple: boolean) {

    if (multiple !== this._multiple) {
      this._multiple = multiple;

      if (!this._multiple) {
        const selected = this.selected;
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
    this._selectionSubject.next(this.selected);
  }

  private selectInternal(values: T[]): boolean {
    if (values && values.length > 0) {

      if (this._multiple) {
        // Multi selection
        values.forEach(value => {
          this._selection.set(this._keyGetter(value), value);
        });
      } else {
        // Single selection
        this._selection.clear();
        const single = values[0]; // Maybe last is better?
        this._selection.set(this._keyGetter(single), single);
      }
      return true;
    }
    return false;
  }
}
