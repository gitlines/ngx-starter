import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {flatMap, map, startWith} from 'rxjs/operators';
import {ElderDataTransferService} from '../elder-data-transfer.service';
import {DataTransferState} from '../../../common/http/transfer/data-transfer-state';
import {BytesPerSecondFormat} from '../../../common/format/bytes-per-second-format';
import {HttpDataTransfer} from '../../../common/http/transfer/http-data-transfer';

export class TransferProgressAggregate {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  public static Empty = new TransferProgressAggregate(
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

  public static aggregate(states: DataTransferState[]): TransferProgressAggregate {
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

    return new TransferProgressAggregate(
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


@Component({
  selector: 'elder-data-transfer-aggregate',
  templateUrl: './http-data-transfer-aggregate.component.html',
  styleUrls: ['./http-data-transfer-aggregate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HttpDataTransferAggregateComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  public aggregate$: Observable<TransferProgressAggregate>;

  @Input()
  public hiddenWhenInactive = true;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private transferService: ElderDataTransferService
  ) { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {

    this.aggregate$ = this.transferService.transfers.pipe(
      flatMap(transfers => this.aggregateProgress(transfers)),
      startWith(TransferProgressAggregate.Empty)
    );
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private aggregateProgress(transfers: HttpDataTransfer[]): Observable<TransferProgressAggregate> {

    const transfersInProgress = transfers
        .filter(t => !t.stateSnapshot.isDone)
        .map(t => t.state$);

    return combineLatest(transfersInProgress).pipe(
      map(latestTransferStates => TransferProgressAggregate.aggregate(latestTransferStates))
    );
  }


}
