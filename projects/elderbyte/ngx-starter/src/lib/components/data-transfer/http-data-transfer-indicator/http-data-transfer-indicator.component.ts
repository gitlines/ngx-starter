import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import {Observable} from 'rxjs';
import {ElderDataTransferService} from '../elder-data-transfer.service';
import {DataTransferProgressAggregate} from '../../../common/http/transfer/data-transfer-progress-aggregate';

@Component({
  selector: 'elder-data-transfer-indicator',
  templateUrl: './http-data-transfer-indicator.component.html',
  styleUrls: ['./http-data-transfer-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HttpDataTransferIndicatorComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  @Input()
  public activeColor = '';

  @Input()
  public inactiveColor = '';

  public aggregate$: Observable<DataTransferProgressAggregate>;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private transferService: ElderDataTransferService,
  ) { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {
    this.aggregate$ = this.transferService.transferAggregate;
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/


}
