import {IDataContextActivePage} from './data-context';
import {DataContextBase} from './data-context-base';
import {Observable} from 'rxjs/Observable';
import {Page, Pageable} from './page';
import {Filter} from './filter';
import {Subject} from 'rxjs/Subject';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';



export class DataContextActivePage<T> extends DataContextBase<T> implements IDataContextActivePage<T> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly actlogger: Logger = LoggerFactory.getLogger('DataContextActivePage');

    private _pageIndex: number;
    private _pageSize: number;

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/


    constructor(
        private pageLoader: (pageable: Pageable, filters: Filter[]) => Observable<Page<T>>,
        pageSize: number,
        _indexFn?: ((item: T) => any),
        _localSort?: ((a: T, b: T) => number),
        _localApply?: ((data: T[]) => T[])) {
        super(_indexFn, _localSort, _localApply);
        this._pageSize = pageSize;
        this._pageIndex = 0;
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

    /***************************************************************************
     *                                                                         *
     * Private methods                                                         *
     *                                                                         *
     **************************************************************************/

    protected loadActivePage(): void {
        this.clear();
        this.loadData();
    }

    protected loadData(): Observable<any> {

        const subject = new Subject();

        this.setLoadingIndicator(true);

        const pageRequest = new Pageable(this.pageIndex, this.pageSize, this.sorts);

        this.pageLoader(pageRequest, this.filters)
            .take(1)
            .subscribe(
            success => {
                this.setTotal(success.totalElements);
                this.setRows(success.content);
                this.setLoadingIndicator(false);
                subject.next(success);
                this.onSuccess();
            }, err => {
                this.setLoadingIndicator(false);
                this.actlogger.error('Failed to query data', err);
                subject.error(err);
                this.onError(err);
            });

        return subject.take(0);
    }



}

