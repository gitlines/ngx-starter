import {IDataContextContinuable} from './data-context';
import {DataContextBase} from './data-context-base';
import {Sort} from './sort';
import {Filter} from './filter';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {Observable} from 'rxjs/index';



/**
 * Extends a simple flat list data-context with infinite-scroll pagination support.
 *
 */
export abstract class DataContextContinuableBase<T> extends DataContextBase<T> implements IDataContextContinuable<T> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly cblogger: Logger = LoggerFactory.getLogger('DataContextContinuableBase');

    private _chunkSize: number;


    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/


    constructor(
        chunkSize: number,
        _indexFn?: ((item: T) => any),
        _localSort?: ((a: T, b: T) => number),
        _localApply?: ((data: T[]) => T[])) {
        super(_indexFn, _localSort, _localApply);
        this._chunkSize = chunkSize;
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/


    public loadAll(sorts?: Sort[], filters?: Filter[]): void {

        this.cblogger.debug('Starting to load all data ...');

        // load first page
        this.start(sorts, filters)
            .subscribe(() => {
                this.cblogger.debug('First page has been loaded. Loading remaining data ...');
                // load rest in a recursive manner
                this.loadAllRec();
            }, err => {
                this.onError(err);
                this.cblogger.error('Failed to load first page of load all procedure!', err);
            });
    }

    public get chunkSize(): number {
        return this._chunkSize;
    }

    public set chunkSize(size: number) {
        this._chunkSize = size;
    }

    /***************************************************************************
     *                                                                         *
     * Private Methods                                                         *
     *                                                                         *
     **************************************************************************/

    protected onChunkSizeChanged(newSize: number): void {  }

    private loadAllRec(): void {
        this.loadMore()
            .subscribe(() => {
                this.cblogger.debug('Loading data chunk finished, loading next...');
                this.loadAllRec();
            }, err => {
                this.onError(err);
                this.cblogger.error('Loading all failed!', err);
            }, () => {
                this.cblogger.info('All data loaded completely.');
            });
    }

    public abstract loadMore(): Observable<any>;
    public abstract get hasMoreData(): boolean;
}
