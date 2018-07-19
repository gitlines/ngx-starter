
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpParamsBuilder} from '../http-params-builder';
import {Sort} from '../sort';
import {Filter} from '../filter';
import {Page, Pageable} from '../page';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {ContinuableListing} from '../continuable-listing';
import {TokenChunkRequest} from '../token-chunk-request';

export class RestClient<T, TID> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly localChangeSubject = new Subject<T>();

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        protected readonly restEndpoint: string,
        protected readonly http: HttpClient,
        protected readonly idsParam: string
    ) {

    }

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/

    public get localChanged(): Observable<T> {
        return this.localChangeSubject.asObservable();
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public findById(id: TID): Observable<T> {
        return this.http.get<T>(this.getEntityUrl(id));
    }

    /**
     * Creates or Updates the given entity depending if it already has a valid id.
     */
    public save(entity: T): Observable<T> {
        const id = this.getId(entity);
        return ((!!id) ? this.update(entity) : this.create(entity));
    }

    public create(newEntity: T): Observable<T> {
        return this.http.post<T>(this.restEndpoint, newEntity)
            .pipe(
                tap(e => this.onLocalChanged(e))
            );
    }

    public update(updatedEntity: T): Observable<T> {
        return this.http.put<T>(this.getEntityUrlBy(updatedEntity), updatedEntity)
            .pipe(
                tap(e => this.onLocalChanged(e))
            );
    }

    public delete(entity: T): Observable<any> {
        return this.http.delete(this.getEntityUrlBy(entity), { responseType: 'text' })
            .pipe(
                tap(() => this.onLocalChanged(entity))
            );
    }

    public deleteAll(entities: T[]): Observable<any> {
        let params = new HttpParams();
        entities.forEach(e => params = params.append(this.idsParam, String(this.getId(e))));
        return this.http.delete(this.restEndpoint,
            {
                params: params,
                responseType: 'text'
            })
            .pipe(
                tap(() => this.onLocalChanged())
            );
    }

    /***************************************************************************
     *                                                                         *
     * Sub Resource Builder                                                    *
     *                                                                         *
     **************************************************************************/

    public subResourceList<TS, TSID>(parent: T, subPath: string, idsParam = 'ids'): RestClientList<TS, TSID> {
        return new RestClientList(
            this.getEntityUrlBy(parent) + '/' + subPath,
            this.http,
            idsParam
        );
    }

    public subResourcePaged<TS, TSID>(parent: T, subPath: string, idsParam = 'ids'): RestClientPaged<TS, TSID> {
        return new RestClientPaged(
            this.getEntityUrlBy(parent) + '/' + subPath,
            this.http,
            idsParam
        );
    }

    public subResourceContinuable<TS, TSID>(parent: T, subPath: string, idsParam = 'ids'): RestClientContinuable<TS, TSID> {
        return new RestClientContinuable(
            this.getEntityUrlBy(parent) + '/' + subPath,
            this.http,
            idsParam
        );
    }

    /***************************************************************************
     *                                                                         *
     * Protected methods                                                       *
     *                                                                         *
     **************************************************************************/

    protected getId(entity: T): TID {
        return entity['id'] as TID;
    }

    protected onLocalChanged(entity?: T): void {
        this.localChangeSubject.next(entity);
    }

    protected getEntityUrlBy(entity: T): string {
        return this.getEntityUrl(this.getId(entity));
    }

    protected getEntityUrl(id: TID): string {
        return this.restEndpoint + '/' + id;
    }
}



export class RestClientList<T, TID> extends RestClient<T, TID> {

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    restEndpoint: string,
    http: HttpClient,
    idsParam = 'ids'
  ) {
    super(restEndpoint, http, idsParam);
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public findAllFiltered(filters?: Filter[], sorts?: Sort[]): Observable<T[]> {
    return this.findAll(
      HttpParamsBuilder.start()
        .appendFilters(filters)
        .appendSorts(sorts)
        .build()
    );
  }

  public findAll(params?: HttpParams): Observable<T[]> {
    return this.http.get<T[]>(this.restEndpoint, {
      params: params
    });
  }

}


export class RestClientPaged<T, TID> extends RestClient<T, TID> {

  private readonly logger = LoggerFactory.getLogger('RestClientPaged');

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    restEndpoint: string,
    http: HttpClient,
    idsParam = 'ids'
  ) {
    super(restEndpoint, http, idsParam);
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public findAllPaged(pageable: Pageable, filters?: Filter[], params?: HttpParams): Observable<Page<T>> {
    return this.getPaged(this.restEndpoint, pageable, filters, params);
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/


  /**
   * Gets the requested data page as Page<T>
   * @param url The resource url
   * @param pageable The page request
   * @param filters The filters request
   * @param params Additional parameters
   */
  private getPaged(url: string, pageable: Pageable, filters?: Filter[], params?: HttpParams): Observable<Page<T>> {
    params = HttpParamsBuilder.start(params)
      .appendPageable(pageable)
      .appendFilters(filters)
      .build();
    return this.http.get<Page<T>>(url, { params: params });
  }

}

export class RestClientContinuable<T, TID> extends RestClient<T, TID> {

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    restEndpoint: string,
    http: HttpClient,
    idsParam = 'ids'
  ) {
    super(restEndpoint, http, idsParam);
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public findAllContinuable(request: TokenChunkRequest, params?: HttpParams): Observable<ContinuableListing<T>> {

    return this.http.get<ContinuableListing<T>>(this.restEndpoint,
      {
        params: HttpParamsBuilder.start(params)
          .appendContinuationRequest(request)
          .build()
      }
    );
  }

}
