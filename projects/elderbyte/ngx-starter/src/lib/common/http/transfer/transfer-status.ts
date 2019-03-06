
export enum TransferStatus {

  /**
   * This upload is prepared but has not yet started.
   */
  Pending = 'Pending',

  /**
   * This data transfer is currently in progress
   */
  Transferring = 'Transferring',

  /**
   * This upload is completed
   */
  Completed = 'Completed',

  /**
   * This upload failed.
   */
  Failed = 'Failed'
}
