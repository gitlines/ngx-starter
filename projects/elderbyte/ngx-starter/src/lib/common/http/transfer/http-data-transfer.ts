import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {HttpErrorResponse, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse} from '@angular/common/http';
import {catchError, map, takeUntil, tap} from 'rxjs/operators';
import {TransferStatus} from './transfer-status';
import {TransferProgressEvent} from './transfer-progress-event';


/**
 * Represents a Http data transfer, either a download or upload.
 */
export class HttpDataTransfer {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly _status = new BehaviorSubject<TransferStatus>(TransferStatus.Pending);
  private readonly _progressEvent = new Subject<TransferProgressEvent>();
  private readonly _httpRequest: Observable<HttpEvent<any>>;

  private readonly _error = new BehaviorSubject<HttpErrorResponse>(null);

  private readonly abort$ = new Subject();

  private _progressSnapshot: TransferProgressEvent;

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
   */
  private constructor(
    httpRequest: Observable<HttpEvent<any>>,
  ) {
    this._httpRequest = httpRequest;
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

            const transferEvent = this.transferEvent(event);
            this._progressEvent.next(transferEvent);
            this._progressSnapshot = transferEvent;
            if (this.statusSnapshot === TransferStatus.Pending) {
              this._status.next(TransferStatus.Transferring);
            }
          } else if (event instanceof HttpResponse) {
            // Close the progress-stream if we get an answer form the API
            // The upload is complete
          }
        }, err => {
          this._error.next(err);
          this._status.next(TransferStatus.Failed);
        },
        () => {
          if (this.statusSnapshot === TransferStatus.Transferring) {
            this._status.next(TransferStatus.Completed);
            this._endTimeMs = new Date().getTime();
          }
          this._progressEvent.complete();
          this._error.complete();
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

  public get progressEvent(): Observable<TransferProgressEvent> {
    return this._progressEvent.asObservable();
  }

  public get progress(): Observable<number> {
    return this.progressEvent.pipe(
      map(event => event.percentDone)
    );
  }

  /**
   * The upload status over time
   */
  public get status(): Observable<TransferStatus> {
    return this._status.asObservable();
  }

  /**
   * The current upload status
   */
  public get statusSnapshot(): TransferStatus {
    return this._status.value;
  }

  /**
   * The current error value
   * (Null if not failed)
   */
  public get errorSnapshot(): HttpErrorResponse | null {
    return this._error.getValue();
  }

  /**
   * The current progress value.
   * (Null if not yet started)
   */
  public get progressSnapshot(): TransferProgressEvent | null {
    return this._progressSnapshot;
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private transferEvent(event: HttpProgressEvent): TransferProgressEvent {

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

    return new TransferProgressEvent(
      event.loaded,
      bytesPerSec,
      avgBytesPerSec,
      event.total,
      percentDone
    );
  }

}
