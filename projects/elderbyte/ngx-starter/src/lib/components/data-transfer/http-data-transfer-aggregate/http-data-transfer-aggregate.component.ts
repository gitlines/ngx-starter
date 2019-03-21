import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ElderDataTransferService} from '../elder-data-transfer.service';
import {DataTransferProgressAggregate} from '../../../common/http/transfer/data-transfer-progress-aggregate';


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

  public aggregate$: Observable<DataTransferProgressAggregate>;

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
    this.aggregate$ = this.transferService.transferAggregate;
  }

}
