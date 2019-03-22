import {HttpClient} from '@angular/common/http';
import {HttpDataTransfer} from '../transfer/http-data-transfer';
import {DataTransferFactory} from '../transfer/data-transfer-factory';
import {ElderDataTransferService} from '../../../components/data-transfer/elder-data-transfer.service';


export interface IFileUploadClient {
  uploadFiles(files: Set<File>): Map<File, HttpDataTransfer>;
  uploadFile(file: File): HttpDataTransfer;
}

export class FileUploadClient implements IFileUploadClient {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly dataTransferFactory: DataTransferFactory;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private http: HttpClient,
    private transferManager: ElderDataTransferService,
    protected readonly endpointUrl: string,
    private requestMethod: 'POST' | 'PUT' | 'PATCH'
  ) {
    this.dataTransferFactory = new DataTransferFactory(http);
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public uploadFiles(files: Set<File>): Map<File, HttpDataTransfer> {

    const allProgress = new Map<File, HttpDataTransfer>();

    files.forEach(file => {
      // create a new upload job for every file
      allProgress.set(file, this.createUploadTransfer(file));
    });

    const transfers = Array.from(allProgress.values());

    this.transferManager.enqueueAll(transfers);

    return allProgress;
  }

  public uploadFile(file: File): HttpDataTransfer {
    return this.transferManager.enqueue(
      this.createUploadTransfer(file)
    );
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private createUploadTransfer(file: File): HttpDataTransfer {
    return this.dataTransferFactory.buildFileFormDataUpload(this.requestMethod, this.endpointUrl, file);
  }
}
