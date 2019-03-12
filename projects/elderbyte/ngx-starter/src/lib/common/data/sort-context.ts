import {BehaviorSubject, Observable} from 'rxjs';
import {Sort, SortDirection} from './sort';

export class SortContext {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly _sorts = new BehaviorSubject<Sort[]>([]);

  /***************************************************************************
   *                                                                         *
   * Read API                                                                *
   *                                                                         *
   **************************************************************************/

  public get sorts(): Observable<Sort[]> {
    return this._sorts.asObservable();
  }

  public get sortsSnapshot(): Sort[] {
    return this._sorts.getValue();
  }

  public findSortDirection(prop: string): SortDirection | undefined {
    const f = this.findSort(prop);
    return f ? f.dir : undefined;
  }

  public findSort(prop: string): Sort | undefined {
    return this.sortsSnapshot
      .filter(f => f.prop === prop)
      .find(first => true);
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * This method updatees / adds the given sort, leaving
   * existing ones untouched.
   * @param updatedSort
   */
  public updateSort(updatedSort?: Sort): void {
    if (updatedSort) {
      this.updateSorts([updatedSort]);
    }
  }

  /**
   * This method updates / adds the given filters, leaving
   * existing ones untouched.
   * @param updatedSorts
   */
  public updateSorts(updatedSorts?: Sort[]): void {
    if (updatedSorts && updatedSorts.length > 0) {
      const sortMap = new Map<string, Sort>();
      this.sortsSnapshot.forEach(s => sortMap.set(s.prop, s));
      updatedSorts.forEach(s => sortMap.set(s.prop, s));
      this.replaceSorts(
        Array.from(updatedSorts.values())
      );
    }
  }

  /**
   * Replace all existing filters with the given new ones.
   * @param newSorts
   */
  public replaceSorts(newSorts?: Sort[]) {
    this._sorts.next(newSorts || []);
  }

  public clear(): void {
    this.replaceSorts([]);
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

}
