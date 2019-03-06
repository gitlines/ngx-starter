import {BehaviorSubject, Observable} from 'rxjs';
import {HttpErrorResponse, HttpEvent} from '@angular/common/http';

export enum FileUploadStatus {

  /**
   * This upload is prepared but has not yet started.
   */
  Pending,

  /**
   * This upload is currently in progress
   */
  Uploading,

  /**
   * This upload is completed
   */
  Completed,

  /**
   * This upload failed.
   */
  Failed
}

/**
 * Represents a file upload request.
 *
 * Note that you have to subscribe to the httpRequest property
 * to start the actual uploading.
 */
export class FileUpload {
  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly _status = new BehaviorSubject<FileUploadStatus>(FileUploadStatus.Pending);

  private _errorSnapshot: HttpErrorResponse;
  private _progressSnapshot: number;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    /**
     * The http request.
     * Subscribe to the observable to start the upload.
     */
    public readonly httpRequest: Observable<HttpEvent<any>>,

    /**
     * The upload progress [0-100]
     */
    public readonly progress: Observable<number>,

    /**
     * If there was an error while uploading
     */
    public readonly error: Observable<HttpErrorResponse>

  ) {

    this.error.subscribe(err => {
      this._errorSnapshot = err;
      this._status.next(FileUploadStatus.Failed);
    });

    this.progress.subscribe(
      prg => {
        this._progressSnapshot = prg;
        if (this.statusSnapshot === FileUploadStatus.Pending) {
          this._status.next(FileUploadStatus.Uploading);
        }
      },
      err => {},
      () => {
        if (this.statusSnapshot === FileUploadStatus.Uploading) {
          this._status.next(FileUploadStatus.Completed);
        }
      }
    );
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * The upload status over time
   */
  public get status(): Observable<FileUploadStatus> {
    return this._status.asObservable();
  }

  /**
   * The current upload status
   */
  public get statusSnapshot(): FileUploadStatus {
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
  public get progressSnapshot(): number | null {
    return this._progressSnapshot;
  }
}
