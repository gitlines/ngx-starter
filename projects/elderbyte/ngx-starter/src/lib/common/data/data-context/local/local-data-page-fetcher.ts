import {Page, Pageable} from '../../page';
import {Filter} from '../../filter';
import {Observable} from 'rxjs';
import {LocalDataListFetcher} from './local-data-list-fetcher';
import {map} from 'rxjs/operators';
import {Sort} from '../../sort';

export class LocalDataPageFetcher<T> {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly localListFetcher: LocalDataListFetcher<T>;
  private readonly localSort: ((data: T[], sorts: Sort[]) => T[]);

  /***************************************************************************
   *                                                                         *
   * Static Builder                                                          *
   *                                                                         *
   **************************************************************************/

  public static from<T>(
    localData: T[],
    localSort?: ((data: T[], sorts: Sort[]) => T[])
  ): LocalDataPageFetcher<T> {
    return new LocalDataPageFetcher(localData, localSort);
  }

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    localData: T[],
    localSort?: ((data: T[], sorts: Sort[]) => T[])
  ) {
    if (!localData) { throw new Error('localData must not be null!'); }
    this.localListFetcher = new LocalDataListFetcher(localData);
    this.localSort = localSort || ((data, sort) => data);
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public findAllPaged(pageable: Pageable, filters?: Filter[]): Observable<Page<T>> {
    return this.localListFetcher.findAll(filters, pageable.sorts).pipe(
      map(data => this.localSort(data, pageable.sorts)),
      map(data => this.pageSlice(pageable, data))
    );
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private pageSlice(pageable: Pageable, data: T[]): Page<T> {
    let page: Page<T>;

    if (data) {
        const start = pageable.page * pageable.size;
        const end = start + pageable.size;
        const slice = data.slice(start, end);
        page = Page.fromPage(slice, data.length, pageable);
    } else {
      page = Page.from([]);
    }
    return page;
  }
}
