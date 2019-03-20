
export enum DataTransferStatus {

  /**
   * This data transfer is prepared but has not yet started.
   */
  Pending = 'Pending',

  /**
   * This data transfer is currently in progress
   */
  Transferring = 'Transferring',

  /**
   * This data transfer is completed
   */
  Completed = 'Completed',

  /**
   * This data transfer failed.
   */
  Failed = 'Failed',

  /**
   * This data transfer was aborted.
   */
  Aborted = 'Aborted'
}
