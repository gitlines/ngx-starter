import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ElderDataTransferService} from '../elder-data-transfer.service';
import {HttpDataTransfer} from '../../../common/http/transfer/http-data-transfer';

@Component({
  selector: 'elder-data-transfer-overview',
  templateUrl: './http-data-transfer-overview.component.html',
  styleUrls: ['./http-data-transfer-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HttpDataTransferOverviewComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  public transfers$: Observable<HttpDataTransfer[]>;

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
    this.transfers$ =  this.transferService.transfers;
  }
}
