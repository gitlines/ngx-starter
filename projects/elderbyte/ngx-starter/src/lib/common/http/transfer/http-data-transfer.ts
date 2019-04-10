import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse, HttpSentEvent} from '@angular/common/http';
import {catchError, filter, first, map, takeUntil, tap} from 'rxjs/operators';
import {DataTransferProgress} from './data-transfer-progress';
import {DataTransferState} from './data-transfer-state';
import {LoggerFactory} from '@elderbyte/ts-logger';



/**
 * Represents a Http data transfer, either a download or upload.
 */
export class HttpDataTransfer {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private logger = LoggerFactory.getLogger('HttpDataTransfer');

  private readonly _state: BehaviorSubject<DataTransferState>;

  private readonly _httpRequest: Observable<HttpEvent<any>>;
  private readonly abort$ = new Subject();

  private readonly _name: string;

  private _startTimeMs: number;
  private _endTimeMs: number;
  private _currTimeMs: number;
  private _prevTimeMs: number;
  private _oldBytes = 0;


  /***************************************************************************
   *                                                                         *
   * Static Builder                                                          *
   *                                                                         *
   **************************************************************************/

  /**
   * Creates a new HttpDataTransfer from a HttpClient HttpRequest.
   * @param httpRequest
   * @param name Name of this transfer
   * @param totalBytes The total expected bytes
   */
  public static fromRequest(
    httpRequest: Observable<HttpEvent<any>>,
    name?: string,
    totalBytes?: number
  ): HttpDataTransfer {
    return new HttpDataTransfer(httpRequest, name, totalBytes);
  }

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  /**
   * Creates a new HttpDataTransfer
   * @param httpRequest The http request.
   * @param name The name of this transfer (usually the file name)
   * @param totalBytes The total bytes of the transfer. (If not set, will be auto discovered if possible)
   */
  private constructor(
    httpRequest: Observable<HttpEvent<any>>,
    name?: string,
    totalBytes?: number
  ) {
    this._name = name;
    this._httpRequest = httpRequest;
    this._state = new BehaviorSubject(DataTransferState.pending(totalBytes));
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Starts the data transfer
   */
  public start(): Observable<HttpEvent<any>> {
    return this._httpRequest.pipe(
      takeUntil(this.abort$),
      tap(event => {

          switch (event.type) {

            case HttpEventType.Sent:
              this.onStart(event);
              break;
            case HttpEventType.UploadProgress:
            case HttpEventType.DownloadProgress:
              this.onProgress(event);
              break;
            case HttpEventType.Response:
              this.onComplete(event);
              break;
          }
        },
        err => this.onError(err),
        () => this.finally()
      ),
      catchError(err => {
        return of(err);
      })
    );
  }

  /**
   * Aborts the data transfer
   */
  public abort(): void {
    this.abort$.next();
    this.emitState(
      DataTransferState.aborted(this.stateSnapshot.progress)
    );
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Awaits until this transfer is done and closes the observable.
   *
   * If successful, emits true. Observable is closed.
   * If aborted, emits false. Observable is closed.
   * If failed, throws error. Observable is closed.
   */
  public get done$(): Observable<boolean> {
    return this.state$.pipe(
      filter(state => state.isDone),
      map(state => {
        if (state.isCompleted) { return true; }
        if (state.isAborted) { return false; }

        if (state.hasFailed) {
          throw state.error ? state.error : 'Completion Failed due unknown error!';
        }
      }),
      first()
    );
  }

  /**
   * Get the state of this data transfer over time.
   * Unsubscribe after use.
   */
  public get state$(): Observable<DataTransferState> {
    return this._state.asObservable();
  }

  /**
   * Get a snapshot of the current state of this data transfer
   */
  public get stateSnapshot(): DataTransferState {
    return this._state.getValue();
  }

  public get name(): string {
    return this._name;
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private onStart(event: HttpSentEvent): void {
    this.emitState(
      DataTransferState.started(this.stateSnapshot.progress.totalBytes)
    );
  }

  private onProgress(event: HttpProgressEvent): void {
    const progress = this.transferProgress(event);
    this.emitState(
      DataTransferState.transferring(progress)
    );
  }

  private onComplete(event: HttpResponse<any>): void {
    this.emitState(
      DataTransferState.completed(
        this.transferProgressFromResponse(event, this.stateSnapshot.progress)
      )
    );
  }

  private onError(error: any): void {
    this.emitState(
      DataTransferState.failed(error, this.stateSnapshot.progress)
    );
  }

  private finally(): void {
    this._endTimeMs = new Date().getTime();
    if (!this.stateSnapshot.isDone) {
      this.logger.warn('DataTransfer did not reach done-state! Completing Transfer now...');
      this.emitState(
        DataTransferState.completed(this.stateSnapshot.progress)
      );
    }
  }

  private emitState(newState: DataTransferState): void {
    this._state.next(newState);
  }


  private transferProgressFromResponse(
    event: HttpResponse<any>,
    previous?: DataTransferProgress
  ): DataTransferProgress {

    return new DataTransferProgress(
      previous ? previous.totalBytes : 0,
      previous ? previous.bytesPerSec : 0,
      previous ? previous.avgBytesPerSec : 0,
      previous ? previous.totalBytes : 0,
      100
    );
  }

  private transferProgress(event: HttpProgressEvent): DataTransferProgress {

    this._currTimeMs = new Date().getTime();

    // setting start time
    if (!this._startTimeMs) {
      this._startTimeMs = new Date().getTime();
      this._prevTimeMs = this._startTimeMs;
    }

    // tracking how much data is received and
    const bytesReceivedTotal = event.loaded;
    const bytesReceived = bytesReceivedTotal - this._oldBytes;

    const durationMs = (this._currTimeMs - this._prevTimeMs);
    const durationSec = durationMs / 1000;

    // Calc transfer speed per percent data received
    const bytesPerSec = bytesReceived / durationSec;

    // updating previous values
    this._prevTimeMs = this._currTimeMs;
    this._oldBytes = bytesReceivedTotal;

    // Calc avg speed
    const durationSinceStartMs = (this._currTimeMs - this._startTimeMs);
    const durationSinceStartSec = durationSinceStartMs / 1000;
    const avgBytesPerSec = event.loaded / durationSinceStartSec;

    // Calc progress if possible
    const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : undefined;

    return new DataTransferProgress(
      event.loaded,
      bytesPerSec,
      avgBytesPerSec,
      event.total,
      percentDone
    );
  }

}
