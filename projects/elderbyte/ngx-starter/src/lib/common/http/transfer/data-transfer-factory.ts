import {HttpDataTransfer} from './http-data-transfer';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';

/**
 * Responsible for building HttpDataTransfer jobs.
 */
@Injectable({
  providedIn: 'root'
})
export class DataTransferFactory {

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
  public buildFileUpload(
    requestMethod: 'POST' | 'PUT' | 'PATCH',
    endpointUrl: string,
    file: File,
    options?: {
      headers?: HttpHeaders,
      params?: HttpParams
    }): HttpDataTransfer {

    // Create a Http request and pass the form
    // Tell it to report the upload progress
    const req = new HttpRequest(requestMethod, endpointUrl, file, {
      reportProgress: true,
      headers: options ? options.headers : undefined,
      params: options ? options.params : undefined
    });

    return this.buildOfRequest(req, file.name, file.size);
  }

  /**
   * Creates a new progress tracking upload job from the given File.
   *
   * @param requestMethod  The HTTP method (usually POST or PUT)
   * @param endpointUrl The url to send the request to
   * @param formFile The file to construct the Form Data form
   * @param formName The file name of the Form Data
   * @param options (Optional) Additional headers or query params
   */
  public buildFileFormDataUpload(
    requestMethod: 'POST' | 'PUT' | 'PATCH',
    endpointUrl: string,
    formFile: File,
    formName: string = 'file',
    options?: {
      headers?: HttpHeaders,
      params?: HttpParams
    }): HttpDataTransfer {

    const formData: FormData = new FormData();
    formData.append(formName, formFile, formFile.name);

    return this.buildFormDataUpload(
      requestMethod,
      endpointUrl,
      formData,
      options,
      formFile.name,
      formFile.size
    );
  }

  /**
   * Creates a new progress tracking upload job from the given Form Data.
   *
   * @param requestMethod The HTTP method (usually POST or PUT)
   * @param endpointUrl The url to send the request to
   * @param formData The Form Data
   * @param options (Optional) Additional headers or query params
   * @param name
   * @param size
   */
  public buildFormDataUpload(
    requestMethod: 'POST' | 'PUT' | 'PATCH',
    endpointUrl: string,
    formData: FormData,
    options?: {
      headers?: HttpHeaders,
      params?: HttpParams
    },
    name?: string,
    size?: number
  ): HttpDataTransfer {

    // Create a Http request and pass the form
    // Tell it to report the upload progress
    const req = new HttpRequest(requestMethod, endpointUrl, formData, {
      reportProgress: true,
      headers: options ? options.headers : undefined,
      params: options ? options.params : undefined
    });

    return this.buildOfRequest(req, name, size);
  }

  /**
   * Creates a new progress tracking upload job from a low level
   * http request.
   *
   * @param request The upload http request
   * @param name The data transfer name
   * @param size The data transfer  size
   */
  public buildOfRequest(
    request: HttpRequest<{}>,
    name: string,
    size: number
    ): HttpDataTransfer {

    return HttpDataTransfer.fromRequest(
      this.http.request(request),
      name,
      size
    );
  }

}
