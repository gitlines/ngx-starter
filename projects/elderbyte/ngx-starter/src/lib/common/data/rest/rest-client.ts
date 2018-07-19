
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {RestClientList} from './rest-client-list';
import {RestClientPaged} from './rest-client-paged';
import {RestClientContinuable} from './rest-client-continuable';


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
        return this.http.get<T>(this.getEntityUrl(id))
    };

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

