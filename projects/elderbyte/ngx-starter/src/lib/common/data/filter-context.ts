import {Filter} from './filter';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Objects} from '../objects';

export class FilterContext {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly _filters = new BehaviorSubject<Filter[]>([]);

  /***************************************************************************
   *                                                                         *
   * Read API                                                                *
   *                                                                         *
   **************************************************************************/

  public get filters(): Observable<Filter[]> {
    return this._filters.asObservable();
  }

  public get filtersSnapshot(): Filter[] {
    return this._filters.getValue();
  }

  public findFilterValue(key: string): string | undefined {
    const f = this.findFilter(key);
    return f ? f.value : undefined;
  }

  public findFilter(key: string): Filter | undefined {
    return this.filtersSnapshot
      .filter(f => f.key === key)
      .find(first => true);
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public removeFilter(key: string): void {
    const current = this.filtersSnapshot;
    const newFilters = current.filter(f => f.key !== key);
    if (current.length !== newFilters.length) {
      this.replaceFilters(newFilters);
    }
  }

  /**
   * This method updatees / adds the given filter, leaving
   * existing ones untouched.
   * @param updatedFilter
   */
  public updateFilter(updatedFilter?: Filter): void {
    if (updatedFilter) {
      this.updateFilters([updatedFilter]);
    }
  }

  /**
   * This method updates / adds the given filters, leaving
   * existing ones untouched.
   * @param updatedFilters
   */
  public updateFilters(updatedFilters?: Filter[]): void {
    if (updatedFilters && updatedFilters.length > 0) {
      const filterMap = new Map<string, Filter>();
      this.filtersSnapshot.forEach(f => filterMap.set(f.key, f));
      updatedFilters.forEach(f => {
        if (f.hasValue) {
          filterMap.set(f.key, f);
        } else {
          if (filterMap.has(f.key)) {
            filterMap.delete(f.key);
          }
        }
      });
      this.replaceFilters(
        Array.from(
          updatedFilters.values()
        )
      );
    }
  }

  /**
   * Replace all existing filters with the given new ones.
   * @param newFilters
   */
  public replaceFilters(newFilters?: Filter[]) {
    this._filters.next(newFilters || []);
  }

  public clear(): void {
    this.replaceFilters([]);
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

}
