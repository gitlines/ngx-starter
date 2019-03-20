import {DataTransferStatus} from './data-transfer-status';
import {DataTransferProgress} from './data-transfer-progress';
import {HttpErrorResponse} from '@angular/common/http';


/**
 * Represents a snapshot of the current state.
 * Immutable.
 */
export class DataTransferState {

  /***************************************************************************
   *                                                                         *
   * Static Builder                                                          *
   *                                                                         *
   **************************************************************************/

  public static pending(totalBytes?: number): DataTransferState {
    return new DataTransferState(
      DataTransferStatus.Pending,
      DataTransferProgress.none(totalBytes),
      null
    );
  }

  public static transfering(progress: DataTransferProgress): DataTransferState {
    return new DataTransferState(
      DataTransferStatus.Transferring,
      progress,
      null
    );
  }

  public static completed(progress: DataTransferProgress): DataTransferState {
    return new DataTransferState(
      DataTransferStatus.Completed,
      progress,
      null
    );
  }

  public static failed(err: HttpErrorResponse, progress?: DataTransferProgress): DataTransferState {

    progress = progress ? progress : DataTransferProgress.none();

    return new DataTransferState(
      DataTransferStatus.Failed,
      progress,
      err
    );
  }

  public static aborted(progress?: DataTransferProgress): DataTransferState {

    progress = progress ? progress : DataTransferProgress.none();

    return new DataTransferState(
      DataTransferStatus.Aborted,
      progress,
      null
    );
  }

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  private constructor(
    /**
     * status The current status
     */
    public readonly status: DataTransferStatus,

    /**
     * progress The current progress
     */
    public readonly progress: DataTransferProgress,

    /**
     * error The error response if there was one
     */
    public readonly error: HttpErrorResponse | null

  ) { }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get isPending(): boolean {
    return this.status === DataTransferStatus.Pending;
  }

  public get isTransfering(): boolean {
    return this.status === DataTransferStatus.Transferring;
  }

  public get hasFailed(): boolean {
    return this.status === DataTransferStatus.Failed;
  }

  public get isAborted(): boolean {
    return this.status === DataTransferStatus.Aborted;
  }

  public get isCompleted(): boolean {
    return this.status === DataTransferStatus.Completed;
  }

  /**
   * Checks if the data transfer is over, either sucessfully or error / abort.
   */
  public get isDone(): boolean {
    return this.isCompleted || this.hasFailed || this.isAborted;
  }

}
