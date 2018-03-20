import {Observable} from 'rxjs/Rx';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {Filter} from './filter';
import {ContinuableListing} from './continuable-listing';
import {DataContextContinuableBase} from './data-context-continuable-base';
import {Subject} from 'rxjs/Subject';
import {Sort} from './sort';
import {Page} from './page';


export class TokenChunkRequest {
    constructor (
        public readonly nextContinuationToken: string | null | undefined,
        public readonly filters: Filter[],
        public readonly sorts: Sort[]
    ) {}
}


export class DataContextContinuableToken<T> extends DataContextContinuableBase<T> {


    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger: Logger = LoggerFactory.getLogger('DataContextContinuableToken');

    private _chunkCache: Set<string|undefined> = new Set();

    protected nextContinuationToken?: string;

    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/


    constructor(
        private nextChunkLoader: (tokenChunkRequest: TokenChunkRequest) => Observable<ContinuableListing<T>>,
        chunkSize: number,
        _indexFn?: ((item: T) => any),
        _localSort?: ((a: T, b: T) => number),
        _localApply?: ((data: T[]) => T[])) {
        super(chunkSize, _indexFn, _localSort, _localApply);
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public get hasMoreData(): boolean {
        return !!this.nextContinuationToken;
    }

    public loadMore(): Observable<any> {

        if (this.loadingIndicator) {
            this.logger.debug('Skipping load-more since already loading a chunk!');
            return Observable.empty();
        }

        const token = this.nextContinuationToken;

        if (token && token.length > 0) {
            return this.fetchNextChunk(token);
        } else {
            this.logger.debug('Cannot load more data, since no more data available.');
            return Observable.empty();
        }
    }

    /***************************************************************************
     *                                                                         *
     * Protect API                                                             *
     *                                                                         *
     **************************************************************************/

    protected clear(): void {
        super.clear();
        this._chunkCache.clear();
        this.nextContinuationToken = undefined;
    }

    protected loadData(): Observable<any> {
        return this.fetchNextChunk(undefined);
    }

    private fetchNextChunk(nextToken?: string): Observable<ContinuableListing<T>> {

        this.setLoadingIndicator(true);
        const subject = new Subject<ContinuableListing<T>>();

        nextToken = nextToken ? nextToken : undefined;

        if (this._chunkCache.has(nextToken)) {
            this.logger.trace('Skipping fetching chunk for token "' + nextToken + '" since its already in observable cache.');
            subject.complete();
        } else {

            this._chunkCache.add(nextToken);

            this.nextChunkLoader(new TokenChunkRequest(nextToken, this.filters, this.sorts))
                .take(1)
                .subscribe(
                    chunk => {
                        this.logger.debug('Got next chunk data:', chunk);
                        this.nextContinuationToken = chunk.nextContinuationToken;
                        this.chunkSize = chunk.chunkSize;
                        this.populateChunkData(chunk);
                        this.setLoadingIndicator(false);
                        subject.next(chunk);
                        this.onSuccess();
                    }, err => {
                        this.onError(err);
                        this.logger.error('Failed to query data', err);
                        this.setLoadingIndicator(false);
                        subject.error(err);
                    }
                );
        }
        return subject.take(1);
    }

    /**
     * Load the data from the given page into the current data context
     */
    private populateChunkData(chunk: ContinuableListing<T>): void {
        try {
            this.setTotal(chunk.total);
            let newRows = [...this.rows];
            newRows.push(...chunk.content);
            this.setRows(newRows);
        } catch (err) {
            this.onError(err);
            this.logger.error('Failed to populate data with chunk', chunk, err);
        }
    }

}
