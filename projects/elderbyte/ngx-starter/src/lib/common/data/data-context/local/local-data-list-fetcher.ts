import {Filter} from '../../filter';
import {Sort} from '../../sort';
import {Observable, of} from 'rxjs';


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
    return of(this.localData);
  }


}
