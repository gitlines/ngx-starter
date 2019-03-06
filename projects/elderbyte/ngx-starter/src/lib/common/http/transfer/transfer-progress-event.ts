
export class TransferProgressEvent {
  constructor(
    public readonly doneBytes: number,
    public readonly bytesPerSec: number,
    public readonly avgBytesPerSec: number,
    public readonly totalBytes?: number,
    public readonly percentDone?: number,
  ) { }
}
