import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse} from '@angular/common/http';
import {catchError, takeUntil, tap} from 'rxjs/operators';
import {DataTransferProgress} from './data-transfer-progress';
import {DataTransferState} from './data-transfer-state';



/**
 * Represents a Http data transfer, either a download or upload.
 */
export class HttpDataTransfer {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly _state: BehaviorSubject<DataTransferState>;

  private readonly _httpRequest: Observable<HttpEvent<any>>;
  private readonly abort$ = new Subject();

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
   */
  public static fromRequest(httpRequest: Observable<HttpEvent<any>>): HttpDataTransfer {
    return new HttpDataTransfer(httpRequest);
  }

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  /**
   * Creates a new HttpDataTransfer
   * @param httpRequest The http request.
   * @param totalBytes The total bytes of the transfer. (If not set, will be auto discovered if possible)
   */
  private constructor(
    httpRequest: Observable<HttpEvent<any>>,
    totalBytes?: number
  ) {
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
          if (event.type === HttpEventType.UploadProgress || event.type === HttpEventType.DownloadProgress) {
            const progress = this.transferProgress(event);
            this.emitState(
              DataTransferState.transfering(progress)
            );
          } else if (event instanceof HttpResponse) {
            // Close the progress-stream if we get an answer form the API
            // The upload is complete
          }
        }, err => {
          this.emitState(
            DataTransferState.failed(err, this.stateSnapshot.progress)
          );
        },
        () => {
          this._endTimeMs = new Date().getTime();
          if (this.stateSnapshot.isTransfering) {
            this.emitState(
              DataTransferState.completed(this.stateSnapshot.progress)
            );
          }
        }),
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
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

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

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private emitState(newState: DataTransferState): void {
    this._state.next(newState);
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
