import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';
import {from, Observable, of, ReplaySubject, Subject} from 'rxjs';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {catchError, mergeMap, tap} from 'rxjs/operators';

export interface IFileUploadClient {
  uploadFiles(files: Set<File>): Map<File, FileUpload>;
  uploadFile(file: File): FileUpload;
}

/**
 * Represents a file upload
 */
export class FileUpload {
  constructor(
    /**
     * The http request
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

  ) { }
}

export class FileUploadClient implements IFileUploadClient {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private uploader: FileUploader;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private http: HttpClient,
    protected readonly endpointUrl: string,
    private requestMethod: 'POST' | 'PUT' | 'PATCH'
  ) {
    this.uploader = new FileUploader(http, endpointUrl);
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public uploadFiles(files: Set<File>): Map<File, FileUpload> {
    return this.uploader.uploadFiles(files, this.requestMethod);
  }

  public uploadFile(file: File): FileUpload {
    return this.uploader.uploadFile(file, this.requestMethod);
  }
}


/**
 * Supports uploading files to an http endpoint.
 * Reports progress of the upload.
 */
export class FileUploader {

  private logger = LoggerFactory.getLogger('FileUploader');

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private http: HttpClient,
    protected readonly endpointUrl: string,
  ) { }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public createFile(file: File): FileUpload {
    return this.uploadFile(file, 'POST');
  }

  public updateFile(file: File): FileUpload {
    return this.uploadFile(file, 'PUT');
  }

  public createFiles(files: Set<File>): Map<File, FileUpload> {
    return this.uploadFiles(files, 'POST');
  }

  public updateFiles(files: Set<File>): Map<File, FileUpload> {
    return this.uploadFiles(files, 'PUT');
  }

  /**
   * Upload all given files, returns an observable map to track the progress of each upload.
   * @param files The files to upload
   * @param requestMethod The HTTP method to use for upload requests
   * @param maxConcurrency Max uploading in parallel
   */
  public uploadFiles(files: Set<File>, requestMethod: 'POST' | 'PUT' | 'PATCH', maxConcurrency = 1): Map<File, FileUpload> {

    const allProgress = new Map<File, FileUpload>();

    files.forEach(file => {
      // create a new upload job for every file
      allProgress.set(file, this.createUploadJob(file, requestMethod));
    });

    const jobs = Array.from(allProgress.values());

    // Start upload jobs
    this.uploadConcurrent(jobs, maxConcurrency);

    return allProgress;
  }

  /**
   * Upload the given file, returns an observable to track the progress of the upload.
   * @param file
   */
  public uploadFile(file: File, requestMethod: 'POST' | 'PUT' | 'PATCH'): FileUpload {
    const fileUpload = this.createUploadJob(file, requestMethod);
    this.uploadConcurrent([fileUpload], 1);
    return fileUpload;
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private uploadConcurrent(jobs: FileUpload[], maxConcurrency: number): void {
    from(jobs).pipe(
        mergeMap(j => j.httpRequest, maxConcurrency)
    ).subscribe(
      success => this.logger.trace('Upload successful!', success)
    );
  }


  private createUploadJob(file: File, requestMethod: 'POST' | 'PUT' | 'PATCH'): FileUpload {

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    // create a http-post request and pass the form
    // tell it to report the upload progress
    const req = new HttpRequest(requestMethod, this.endpointUrl, formData, {
      reportProgress: true
    });

    // create a new progress-subject for every file
    const progress = new Subject<number>();
    const error = new ReplaySubject<any>(1);

    // send the http-request and subscribe for progress-updates
    const httpUpload = this.http.request(req).pipe(
      tap(event => {
        if (event.type === HttpEventType.UploadProgress) {

          // calculate the progress percentage
          const percentDone = Math.round(100 * event.loaded / event.total);

          // pass the percentage into the progress-stream
          progress.next(percentDone);

        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      }, err => {},
        () => {
        progress.complete();
        error.complete();
      }),
      catchError(err => {
        this.logger.warn('Upload failed', err);
        progress.next(0);
        error.next(err);
        return of(err);
      })
    );

    return new FileUpload(
      httpUpload,
      progress.asObservable(),
      error.asObservable()
    );
  }

}
