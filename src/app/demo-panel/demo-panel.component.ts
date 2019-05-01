import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IFileUploadClient, FileUploadClient, ElderDialogService,
  SuggestionProvider, ElderDataTransferService} from '@elderbyte/ngx-starter';
import {of} from 'rxjs';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {ElderToastService} from '../../../projects/elderbyte/ngx-starter/src/lib/components/toasts/elder-toast.service';

@Component({
  selector: 'starter-demo-demo-panel',
  templateUrl: './demo-panel.component.html',
  styleUrls: ['./demo-panel.component.scss']
})
export class DemoPanelComponent implements OnInit {

  private readonly logger = LoggerFactory.getLogger('DemoPanelComponent');

  public date: Date = new Date();


  public durationMs = 350;
  public durationNano = 450;
  public durationMicro = 888;

  public durationSeconds = 30;
  public durationSecondsMinutes = 35 + (60 * 5);
  public durationSecondsHours = 3 * (60 * 60);
  public durationSecondsDays = 4 * 26 * (60 * 60);
  public durationSecondsMonths = 7 * 20 * 4 * 26 * (60 * 60);
  public durationSecondsYears = 3 * 12 * 20 * 4 * 26 * (60 * 60);

  public dateTimeSummerUs = '2018-07-05T08:15:30-05:00';
  public dateTimeSummerZurich = '2018-07-05T08:15:30+02:00';
  public dateTimeSummerUtc = '2018-07-05T08:15:30Z';

  public dateTimeWinterUs = '2018-12-05T08:15:30-05:00';
  public dateTimeWinterZurich = '2018-12-05T08:15:30+01:00';
  public dateTimeWinterUtc = '2018-12-05T08:15:30Z';



  public expanded: boolean;
  public uploadClient: IFileUploadClient;

  public myLabels = ['hello', 'world'];
  public mySuggestions = ['Apple', 'Babbple', 'Here', 'there'];
  public labelSuggestions = SuggestionProvider.build(
    (filter) => of(
      this.mySuggestions.filter(s => !filter || s.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
    )
  );

  constructor(
    private http: HttpClient,
    private dialogService: ElderDialogService,
    private transferManager: ElderDataTransferService,
    private toastService: ElderToastService
  ) {
    this.uploadClient = new FileUploadClient(
      http,
      transferManager,
      '/woot',
      'POST'
    );
  }

  ngOnInit() {
  }


  public openConfirm(event: any): void {
    this.dialogService.showConfirm({
        title: 'Simple confirmation.',
        message: 'Confirm you understand.',
    }).subscribe();
  }

  public openQuestion(event: any): void {
    this.dialogService.showQuestion({
      title: 'Simple question',
      question: 'Are you sure?',
    }).subscribe();
  }

  public showToastInfo(event: any): void {
    this.toastService.pushInfo('Hello World!');
  }

  public showToastError(event: any): void {
    this.toastService.pushErrorRaw('Some failed', new Error('Why'));
  }

}
