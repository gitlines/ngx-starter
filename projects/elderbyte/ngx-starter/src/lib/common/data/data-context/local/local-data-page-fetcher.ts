import {Page, Pageable} from '../../page';
import {Filter} from '../../filter';
import {Observable} from 'rxjs';
import {LocalDataListFetcher} from './local-data-list-fetcher';
import {map} from 'rxjs/operators';

export class LocalDataPageFetcher<T> {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly localListFetcher: LocalDataListFetcher<T>;

  /***************************************************************************
   *                                                                         *
   * Static Builder                                                          *
   *                                                                         *
   **************************************************************************/

  public static from<T>(localData: T[]): LocalDataPageFetcher<T> {
    return new LocalDataPageFetcher(localData);
  }

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    localData: T[]
  ) {
    if (!localData) { throw new Error('localData must not be null!'); }
    this.localListFetcher = new LocalDataListFetcher(localData);
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public findAllPaged(pageable: Pageable, filters?: Filter[]): Observable<Page<T>> {
    return this.localListFetcher.findAll(filters, pageable.sorts).pipe(
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
