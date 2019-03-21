import {DataTransferState} from './data-transfer-state';
import {BytesPerSecondFormat} from '../../format/bytes-per-second-format';

export class DataTransferProgressAggregate {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  public static Empty = new DataTransferProgressAggregate(
    0,
    0,
    0,
    0
  );

  public readonly percentDone: number;
  public readonly bps: string;

  /***************************************************************************
   *                                                                         *
   * Static builder                                                          *
   *                                                                         *
   **************************************************************************/

  public static aggregate(states: DataTransferState[]): DataTransferProgressAggregate {
    let bytesPerSecAgg = 0;
    let doneBytesAgg = 0;
    let totalBytesAgg = 0;
    let inTransfer = 0;

    states
      .filter(state => !state.isAborted)
      .forEach(state => {

      const progress = state.progress;

      if (progress.percentDone < 100) { // > delta would be better. expose delta?
        bytesPerSecAgg += progress.bytesPerSec;
        inTransfer++;
      } else {
        // done
      }

      doneBytesAgg += progress.doneBytes;
      totalBytesAgg += progress.totalBytes;
    });

    return new DataTransferProgressAggregate(
      doneBytesAgg,
      bytesPerSecAgg,
      totalBytesAgg,
      inTransfer
    );
  }

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
     public readonly doneBytesAgg: number,
     public readonly bytesPerSecAgg: number,
     public readonly totalBytesAgg: number,
     public readonly inTransfer: number,
  ) {
    this.percentDone = totalBytesAgg ? Math.round(100 * doneBytesAgg / totalBytesAgg) : undefined;
    this.bps = BytesPerSecondFormat.formatAsBitsPerSecond(bytesPerSecAgg);
  }
}
