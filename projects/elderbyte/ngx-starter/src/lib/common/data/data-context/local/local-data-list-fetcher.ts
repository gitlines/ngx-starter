import {Filter} from '../../filter';
import {Sort} from '../../sort';
import {Observable, of} from 'rxjs';
import {ComparatorBuilder} from '../../field-comparator';


export class LocalDataListFetcher<T> {

  /***************************************************************************
   *                                                                         *
   * Static Builder                                                          *
   *                                                                         *
   **************************************************************************/

  public static from<T>(localData: T[]): LocalDataListFetcher<T> {
    return new LocalDataListFetcher(localData);
  }

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private readonly localData: T[]
  ) {
    if (!this.localData) { throw new Error('localData must not be null!'); }
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public findAll(filters?: Filter[], sorts?: Sort[]): Observable<T[]> {
    return of(
      this.sortData(
        this.filterData(
          this.localData,
          filters
        ),
        sorts
      )
    );
  }


  private filterData(data: T[], filters: Filter[]): T[] {
    if (filters && filters.length > 0) {
      // TODO Support customizable filters
      // data.filter(item => )
      return data;
    } else {
      return data;
    }
  }

  private sortData(data: T[], sorts: Sort[]): T[] {

    // TODO Support customizable sorts

    if (sorts && sorts.length > 0) {
      const copy = [...this.localData];
      const sortFields = sorts.map(s => (s.dir === 'desc' ? '-' : '') +  s.prop);
      return copy.sort(ComparatorBuilder.fieldSort(...sortFields));
    } else {
      return data;
    }
  }

}
