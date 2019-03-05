import {HttpClient} from '@angular/common/http';
import {from} from 'rxjs';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {mergeMap} from 'rxjs/operators';
import {FileUpload} from './file-upload';
import {FileUploadFactory} from './file-upload-factory';

export interface IFileUploadClient {
  uploadFiles(files: Set<File>): Map<File, FileUpload>;
  uploadFile(file: File): FileUpload;
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

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private logger = LoggerFactory.getLogger('FileUploader');

  private readonly uploadFactory: FileUploadFactory;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private http: HttpClient,
    protected readonly endpointUrl: string,
  ) {
    this.uploadFactory = new FileUploadFactory(http);
  }

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

  private createUploadJob(file: File, requestMethod: 'POST' | 'PUT' | 'PATCH'): FileUpload {
    return this.uploadFactory.fromFileFormData(requestMethod, this.endpointUrl, file);
  }

  private uploadConcurrent(jobs: FileUpload[], maxConcurrency: number): void {
    from(jobs).pipe(
        mergeMap(j => j.httpRequest, maxConcurrency)
    ).subscribe(
      success => this.logger.trace('Upload successful!', success)
    );
  }

}
