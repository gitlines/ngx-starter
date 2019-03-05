
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

export class InternalRestClientConfig {

  public idField = 'id';
  public idsParam = 'ids';

  constructor(userConfig?: RestClientConfig) {
    if (userConfig) {
      if (userConfig.idField) { this.idField = userConfig.idField; }
      if (userConfig.idsParam) { this.idsParam = userConfig.idsParam; }
    }
  }
}

/**
 * Allows to customize the rest client
 */
export class RestClientConfig {

  /**
   * The field to use as id. Defaults to 'id'.
   */
  public idField?: string;

  /**
   * The query param to use for multiple ids. Defaults to 'ids'
   */
  public idsParam?: string;
}


export class RestClient<T, TID> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly localChangeSubject = new Subject<T>();
    protected readonly config: InternalRestClientConfig;

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        protected readonly restEndpoint: string,
        protected readonly http: HttpClient,
        config?: RestClientConfig
    ) {
      this.config = new InternalRestClientConfig(config);
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

    public findById(id: TID, params?: HttpParams): Observable<T> {
        params = HttpParamsBuilder.start(params).build();
        return this.http.get<T>(this.getEntityUrl(id), { params: params });
    }

    /**
     * Creates or Updates the given entity depending if it already has a valid id.
     */
    public save(entity: T): Observable<T> {
        const id = this.getId(entity);
        return ((!!id) ? this.update(entity) : this.create(entity));
    }

    public create<TC = T>(newEntity: TC): Observable<T> {
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

    public updateAll(updatedEntities: T[]): Observable<T[]> {
      return this.http.put<T[]>(this.restEndpoint, updatedEntities)
        .pipe(
          tap(e => this.onLocalChanged())
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
        entities.forEach(e => params = params.append(this.config.idsParam, String(this.getId(e))));
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

    public subResourceList<TS, TSID>(parent: T, subPath: string, config?: RestClientConfig): RestClientList<TS, TSID> {
        return new RestClientList(
            this.getEntityUrlBy(parent) + '/' + subPath,
            this.http,
            config
        );
    }

    public subResourcePaged<TS, TSID>(parent: T, subPath: string, config?: RestClientConfig): RestClientPaged<TS, TSID> {
        return new RestClientPaged(
            this.getEntityUrlBy(parent) + '/' + subPath,
            this.http,
            config
        );
    }

    public subResourceContinuable<TS, TSID>(parent: T, subPath: string, config?: RestClientConfig): RestClientContinuable<TS, TSID> {
        return new RestClientContinuable(
            this.getEntityUrlBy(parent) + '/' + subPath,
            this.http,
            config
        );
    }

    /***************************************************************************
     *                                                                         *
     * Protected methods                                                       *
     *                                                                         *
     **************************************************************************/

    protected getId(entity: T): TID {
        return (entity as any)[this.config.idField] as TID;
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
    config?: RestClientConfig
  ) {
    super(restEndpoint, http, config);
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
    config?: RestClientConfig
  ) {
    super(restEndpoint, http, config);
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
    config?: RestClientConfig
  ) {
    super(restEndpoint, http, config);
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
