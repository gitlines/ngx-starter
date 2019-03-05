import {FileUpload} from './file-upload';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {of, ReplaySubject, Subject} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';

/**
 * Responsible for building FileUpload jobs.
 */
@Injectable({
  providedIn: 'root'
})
export class FileUploadFactory {

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private http: HttpClient,
  ) {

  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/


  /**
   * Creates a new progress tracking upload job from the given File.
   *
   * @param requestMethod  The HTTP method (usually POST or PUT)
   * @param endpointUrl The url to send the request to
   * @param file The file to construct the Form Data form
   * @param options (Optional) Additional headers or query params
   */
  public fromFile(
    requestMethod: 'POST' | 'PUT' | 'PATCH',
    endpointUrl: string,
    file: File,
    options?: {
      headers?: HttpHeaders,
      params?: HttpParams
    }): FileUpload {

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.fromFormData(
      requestMethod,
      endpointUrl,
      formData,
      options
    );
  }

  /**
   * Creates a new progress tracking upload job from the given Form Data.
   *
   * @param requestMethod The HTTP method (usually POST or PUT)
   * @param endpointUrl The url to send the request to
   * @param formData The Form Data
   * @param options (Optional) Additional headers or query params
   */
  public fromFormData(
    requestMethod: 'POST' | 'PUT' | 'PATCH',
    endpointUrl: string,
    formData: FormData,
    options?: {
      headers?: HttpHeaders,
      params?: HttpParams
    }): FileUpload {

    // Create a Http request and pass the form
    // Tell it to report the upload progress
    const req = new HttpRequest(requestMethod, endpointUrl, formData, {
      reportProgress: true,
      headers: options ? options.headers : undefined,
      params: options ? options.params : undefined
    });

    return this.fromRequest(req);
  }

  /**
   * Creates a new progress tracking upload job from a low level
   * http request.
   *
   * @param request The upload http request
   */
  public fromRequest(
    request: HttpRequest<FormData>
    ): FileUpload {

    // create a new progress-subject for every file
    const progress = new Subject<number>();
    const error = new ReplaySubject<any>(1);

    // send the http-request and subscribe for progress-updates
    const httpUpload = this.http.request(request).pipe(
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
