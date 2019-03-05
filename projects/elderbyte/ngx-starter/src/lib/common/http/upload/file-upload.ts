import {Observable} from 'rxjs';
import {HttpErrorResponse, HttpEvent} from '@angular/common/http';

/**
 * Represents a file upload request.
 *
 * Note that you have to subscribe to the httpRequest property
 * to start the actual uploading.
 */
export class FileUpload {
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

  ) { }
}
