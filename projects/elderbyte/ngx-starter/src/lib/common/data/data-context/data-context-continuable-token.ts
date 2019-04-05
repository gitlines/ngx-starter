import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {ContinuableListing} from '../continuable-listing';
import {DataContextContinuableBase} from './data-context-continuable-base';
import {BehaviorSubject, EMPTY, Observable, Subject} from 'rxjs';
import {first, take} from 'rxjs/operators';
import {TokenChunkRequest} from '../token-chunk-request';
import {Sort} from '../sort';

export class DataContextContinuableToken<T> extends DataContextContinuableBase<T> {


  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger: Logger = LoggerFactory.getLogger('DataContextContinuableToken');

  private readonly _hasMoreData = new BehaviorSubject<boolean>(false);
  private readonly _chunkCache: Set<string|undefined> = new Set();

  private _expectedChunkToken?: string;

  // protected nextContinuationToken?: string;

  /***************************************************************************
   *                                                                         *
   * Constructors                                                            *
   *                                                                         *
   **************************************************************************/


  constructor(
    private nextChunkLoader: (tokenChunkRequest: TokenChunkRequest) => Observable<ContinuableListing<T>>,
    chunkSize: number,
    indexFn: ((item: T) => any),
    localApply: ((data: T[]) => T[]),
    localSort: ((data: T[], sorts: Sort[]) => T[])

  ) {
    super(chunkSize, indexFn, localApply, localSort);
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public get hasMoreDataSnapshot(): boolean {
    return this._hasMoreData.getValue();
  }

  public get hasMoreData(): Observable<boolean> {
    return this._hasMoreData.asObservable();
  }

  public loadMore(): Observable<any> {

    if (this.loadingSnapshot) {
      this.logger.debug('Skipping load-more since already loading a chunk!');
      return EMPTY;
    }

    const token = this._expectedChunkToken;

    if (token && token.length > 0) {
      return this.fetchNextChunk(token);
    } else {
      this.logger.debug('Cannot load more data, since no more data available.');
      return EMPTY;
    }
  }

  /***************************************************************************
   *                                                                         *
   * Protect API                                                             *
   *                                                                         *
   **************************************************************************/

  protected clearAll(silent = false): void {
    super.clearAll(silent);
    this._chunkCache.clear();
    this._hasMoreData.next(true);
    this._expectedChunkToken = undefined;
  }

  protected reloadInternal(): Observable<any> {

    // Since continuable data-contexts are appending data,
    // we need to clear it for a reload.
    this.clearAll(true);

    return this.fetchNextChunk(undefined);
  }

  private fetchNextChunk(nextToken?: string): Observable<ContinuableListing<T>> {


    const subject = new Subject<ContinuableListing<T>>();

    nextToken = nextToken ? nextToken : undefined;

    if (this._chunkCache.has(nextToken)) {
      this.logger.debug('Skipping fetching chunk for token "' + nextToken + '" since its already in observable cache.');
      subject.complete();
    } else {

      this.setLoading(true);

      this._chunkCache.add(nextToken);

      this.nextChunkLoader(new TokenChunkRequest(nextToken, this.filter.filtersSnapshot, this.sort.sortsSnapshot))
        .pipe(first())
        .subscribe(
          chunk => {
            this.logger.debug('Got next chunk data:', chunk);
            this._hasMoreData.next(chunk.hasMore);
            this.chunkSize = chunk.chunkSize;
            this.populateChunkData(chunk);
            this.setLoading(false);
            subject.next(chunk);
            this.onSuccess();
          }, err => {
            this.onError(err);
            this.logger.error('Failed to query data', err);
            this.setLoading(false);
            this.setData([]);
            this.setTotal(0);
            subject.error(err);
          }
        );
    }
    return subject.pipe(take(1));
  }

  /**
   * Load the data from the given page into the current data context
   */
  private populateChunkData(chunk: ContinuableListing<T>): void {
    if (this.areTokenEqual(chunk.continuationToken, this._expectedChunkToken)) {
      try {
        this.setTotal(chunk.total);

        if (chunk.continuationToken) {
          // We had previous chunks so append to current data.
          this.appendData(chunk.content);
        } else {
          this.setData(chunk.content);
        }

      } catch (err) {
        this.onError(err);
        this.logger.error('Failed to populate data with chunk', chunk, err);
      }
      this._expectedChunkToken = chunk.nextContinuationToken;
    } else {
      this.logger.warn('Discarding continuable chunk (items: ' + chunk.content.length + ', token: ' + chunk.continuationToken + ' )' +
        ' as it does not match the expected contiunation-token: ' + this._expectedChunkToken);
    }
  }

  private areTokenEqual(token1?: string, token2?: string): boolean {
    if (!token1 && !token2) { return true; }
    return token1 === token2;
  }


}
