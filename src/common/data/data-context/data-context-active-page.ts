import {IDataContextActivePage} from './';
import {DataContextBase} from './data-context-base';
import {Page, Pageable, PageRequest} from '../page';
import {Filter} from '../filter';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {Observable, Subject, Subscription} from 'rxjs/index';
import {take} from 'rxjs/operators';
import {Sort} from '../sort';



export class DataContextActivePage<T> extends DataContextBase<T> implements IDataContextActivePage<T> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly actlogger: Logger = LoggerFactory.getLogger('DataContextActivePage');

    private _pageIndex: number;
    private _pageSize: number;

    private _sub: Subscription;

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/


    constructor(
        private pageLoader: (pageable: Pageable, filters: Filter[]) => Observable<Page<T>>,
        pageSize: number,
        indexFn?: ((item: T) => any),
        localSort?: ((a: T, b: T) => number),
        localApply?: ((data: T[]) => T[]),
        activeSort?: Observable<Sort>,
        activePage?: Observable<PageRequest>) {

        super(indexFn, localSort, localApply, activeSort);

        this._pageSize = pageSize;
        this._pageIndex = 0;

        if (activePage) {
            this._sub = activePage.subscribe(pageRequest => {
                this.loadPage(pageRequest);
            });
        }
    }

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/

    public get pageIndex(): number {
        return this._pageIndex;
    }

    public set pageIndex(index: number) {
        if (this._pageIndex !== index) {
            this._pageIndex = index;
            this.loadActivePage();
        }
    }

    public get pageSize(): number {
        return this._pageSize;
    }

    public set pageSize(size: number) {
        if (this._pageSize !== size) {
            this._pageSize = size;
            this.loadActivePage();
        }
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/


    public close(): void {
        super.close();
        if (this._sub) {
            this._sub.unsubscribe();
        }
    }

    public loadPage(request: PageRequest): void {

        let hasChange = false;

        if (this._pageIndex !== request.pageIndex) {
            this._pageIndex = request.pageIndex;
            hasChange = true;
        }
        if (this._pageSize !== request.pageSize) {
            this._pageSize = request.pageSize;
            hasChange = true;
        }

        if (hasChange) {
            this.loadActivePage();
        }
    }

    /***************************************************************************
     *                                                                         *
     * Private methods                                                         *
     *                                                                         *
     **************************************************************************/

    protected clearAll(): void {
        super.clearAll();
        this._pageIndex = 0;
    }

    protected loadActivePage(): void {
        this.loadData();
    }

    protected loadData(): Observable<any> {

        const subject = new Subject<any>();

        this.setLoadingIndicator(true);

        const pageRequest = new Pageable(this.pageIndex, this.pageSize, this.sorts);

        this.pageLoader(pageRequest, this.filters)
            .pipe(take(1))
            .subscribe(
            success => {
                this.setTotal(success.totalElements);
                this.setRows(success.content);
                this.setLoadingIndicator(false);
                subject.next(success);
                this.onSuccess();
            }, err => {
                this.setLoadingIndicator(false);
                this.setRows([]);
                this.actlogger.error('Failed to query data', err);
                subject.error(err);
                this.onError(err);
            });

        return subject.pipe(take(1));
    }



}

