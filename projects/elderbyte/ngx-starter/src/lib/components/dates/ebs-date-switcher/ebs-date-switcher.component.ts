import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDatepicker, MatDatepickerInputEvent} from '@angular/material';
import {LoggerFactory} from '@elderbyte/ts-logger';

@Component({
  selector: 'ebs-date-switcher',
  templateUrl: './ebs-date-switcher.component.html',
  styleUrls: ['./ebs-date-switcher.component.scss']
})
export class EbsDateSwitcherComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('EbsDateSwitcherComponent');

  public date = new Date();

  @Input()
  public datePickerEnabled = true;

  @Output()
  public dateChange: EventEmitter<Date> = new EventEmitter<Date>();

  @ViewChild(MatDatepicker)
  public picker: MatDatepicker<Date>;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor() {}

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {}

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public previousDay(): void {
    const yesterday = new Date();
    yesterday.setDate(this.date.getDate() - 1);
    this.date = yesterday;
    this.onDateChange(yesterday);
  }

  public nextDay(): void {
    const tomorrow = new Date();
    tomorrow.setDate(this.date.getDate() + 1);
    this.date = tomorrow;
    this.onDateChange(tomorrow);
  }

  public today(): void {
    const today = new Date();
    this.date = today;
    this.onDateChange(today);

  }

  public onDatepickerInputChange(event: MatDatepickerInputEvent<Date>): void {
    this.logger.debug('Datepicker Input has changed: ' + event.value);
    this.onDateChange(event.value);
  }

  public onDatepickerInputClick(event: Event): void {
    if (this.datePickerEnabled) {
      this.picker.open();
    }
  }

  /***************************************************************************
   *                                                                         *
   * Private Methods                                                         *
   *                                                                         *
   **************************************************************************/

  private onDateChange(date: Date) {
    this.logger.debug('Internal date changed to: ' + date);
    this.dateChange.emit(date);
  }

}
