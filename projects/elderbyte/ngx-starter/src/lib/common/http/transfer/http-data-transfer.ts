import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {HttpErrorResponse, HttpEvent, HttpProgressEvent} from '@angular/common/http';
import {map} from 'rxjs/operators';
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

  private _errorSnapshot: HttpErrorResponse;
  private _progressSnapshot: TransferProgressEvent;

  private _startTimeMs: number;
  private _endTimeMs: number;

  private _currTimeMs: number;
  private _prevTimeMs: number;
  private _oldBytes = 0;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  /**
   * Creates a new HttpDataTransfer
   *
   * @param httpProgress
   * @param httpRequest The http request. (Subscribe to the observable to start the upload.)
   * @param error If there was an error while uploading
   */
  constructor(
    private readonly httpProgress: Observable<HttpProgressEvent>,
    public readonly httpRequest: Observable<HttpEvent<any>>,
    public readonly error: Observable<HttpErrorResponse>
  ) {

    this.error.subscribe(err => {
      this._errorSnapshot = err;
      this._status.next(TransferStatus.Failed);
    });

    this.httpProgress.subscribe(
      httpEvent => {
        const transferEvent = this.transferEvent(httpEvent);
        this._progressEvent.next(transferEvent);
        this._progressSnapshot = transferEvent;
        if (this.statusSnapshot === TransferStatus.Pending) {
          this._status.next(TransferStatus.Transferring);
        }
      },
      err => {},
      () => {
        if (this.statusSnapshot === TransferStatus.Transferring) {
          this._status.next(TransferStatus.Completed);
          this._endTimeMs = new Date().getTime();
        }
        this._progressEvent.complete();
      }
    );
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
    return this._errorSnapshot;
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
