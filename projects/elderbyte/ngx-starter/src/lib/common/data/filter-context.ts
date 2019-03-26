import {Filter} from './filter';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Objects} from '../objects';
import {distinctUntilChanged} from 'rxjs/operators';
import {forEach} from '@angular/router/src/utils/collection';

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
    return this._filters.asObservable().pipe(
      distinctUntilChanged((a, b) => this.equals(a, b))
    );
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
          filterMap.values()
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

  private equals(a: Filter[], b: Filter[]): boolean {

    if (a.length !== b.length) { return false; }
    if (a.length === 0 && b.length === 0) { return true; }

    // The both filter arrays have the same length, so we must compare them by value

    const bIndex = new Map<string, Filter>();
    b.forEach(f => bIndex.set(f.key, f));

    for (const fa of a) {
      const bFilter = bIndex.get(fa.key);
      if (bFilter === undefined) {
        return false;
      }
      if (bFilter.value !== fa.value) {
        return false;
      }
    }
    return true;
  }
}
