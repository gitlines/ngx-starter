import {HttpClient, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

export interface IFileUploadClient {
  uploadFiles(files: Set<File>): Map<File, Observable<number>>;
  uploadFile(file: File): Observable<number>;
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

  public uploadFiles(files: Set<File>): Map<File, Observable<number>> {
    return this.uploader.uploadFiles(files, this.requestMethod);
  }

  public uploadFile(file: File): Observable<number> {
    return this.uploader.uploadFile(file, this.requestMethod);
  }
}


/**
 * Supports uploading files to an http endpoint.
 * Reports progress of the upload.
 */
export class FileUploader {

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

  public createFile(file: File): Observable<number> {
    return this.uploadFile(file, 'POST');
  }

  public updateFile(file: File): Observable<number> {
    return this.uploadFile(file, 'PUT');
  }

  public createFiles(files: Set<File>): Map<File, Observable<number>> {
    return this.uploadFiles(files, 'POST');
  }

  public updateFiles(files: Set<File>): Map<File, Observable<number>> {
    return this.uploadFiles(files, 'PUT');
  }

  /**
   * Upload all given files, returns an observable map to track the progress of each upload.
   * @param files
   */
  public uploadFiles(files: Set<File>, requestMethod: 'POST' | 'PUT' | 'PATCH'): Map<File, Observable<number>> {

    const allProgress = new Map<File, Observable<number>>();

    files.forEach(file => {
      // create a new progress-subject for every file
      const progress = this.uploadFile(file, requestMethod);
      allProgress.set(file, progress);
    });

    return allProgress;
  }

  /**
   * Upload the given file, returns an observable to track the progress of the upload.
   * @param file
   */
  public uploadFile(file: File, requestMethod: 'POST' | 'PUT' | 'PATCH'): Observable<number> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    // create a http-post request and pass the form
    // tell it to report the upload progress
    const req = new HttpRequest(requestMethod, this.endpointUrl, formData, {
      reportProgress: true
    });

    // create a new progress-subject for every file
    const progress = new Subject<number>();

    // send the http-request and subscribe for progress-updates
    this.http.request(req).subscribe(event => {
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
    });

    return progress.asObservable();
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/



}
