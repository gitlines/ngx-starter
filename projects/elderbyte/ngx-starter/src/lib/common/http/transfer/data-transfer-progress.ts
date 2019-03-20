/**
 * Represents the current transfer progress
 * Immutable.
 */
export class DataTransferProgress {

  public static none(totalBytes?: number) {
    return new DataTransferProgress(0, 0, 0, totalBytes, 0);
  }

  constructor(
    public readonly doneBytes: number,
    public readonly bytesPerSec: number,
    public readonly avgBytesPerSec: number,
    public readonly totalBytes?: number,
    public readonly percentDone?: number,
  ) { }
}
