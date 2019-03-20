import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {HttpDataTransfer} from '../../../common/http/transfer/http-data-transfer';
import {DataTransferState} from '../../../common/http/transfer/data-transfer-state';
import {BytesPerSecondFormat} from '../../../common/format/bytes-per-second-format';
import {BytesFormat} from '../../../common/format/bytes-format';

@Component({
  selector: 'elder-data-transfer',
  templateUrl: './http-data-transfer.component.html',
  styleUrls: ['./http-data-transfer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HttpDataTransferComponent {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private logger = LoggerFactory.getLogger('HttpDataTransferComponent');
  private _transfer: HttpDataTransfer;

  public $state: Observable<DataTransferState>;
  public $detail: Observable<string>;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor() {
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get transfer(): HttpDataTransfer {
    return this._transfer;
  }

  @Input()
  public set transfer(value: HttpDataTransfer) {
    this._transfer = value;

    this.$state = value.state$;

    this.$detail = value.state$.pipe(
      map(state => {

        if (state.isAborted) { return 'Canceled.'; }
        if (state.hasFailed) { return 'Failed!'; }

        const e = state.progress;

        // 100Mb of 332Mb (1200Kb/sec)
        if (e.percentDone === 100) {
          return BytesFormat.format(e.doneBytes) + '( ' + BytesPerSecondFormat.formatAsBitsPerSecond(e.avgBytesPerSec) + ')';
        } else {
          let progress = BytesFormat.format(e.doneBytes) + ' of ' + BytesFormat.format(e.totalBytes);

          if (e.bytesPerSec) {
            progress += ' (' + BytesPerSecondFormat.formatAsBitsPerSecond(e.bytesPerSec) + ')';
          }
          return progress;
        }
      }),
      // tap(message => this.logger.info(message))
    );

  }



}
