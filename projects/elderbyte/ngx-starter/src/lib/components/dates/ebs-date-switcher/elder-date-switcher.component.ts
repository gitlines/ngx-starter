import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDatepicker, MatDatepickerInputEvent} from '@angular/material';
import {LoggerFactory} from '@elderbyte/ts-logger';

@Component({
  selector: 'elder-date-switcher, ebs-date-switcher',
  templateUrl: './elder-date-switcher.component.html',
  styleUrls: ['./elder-date-switcher.component.scss']
})
export class ElderDateSwitcherComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderDateSwitcherComponent');

  private _date: Date = new Date();

  /** If true, date picker functionality is enabled. */
  @Input()
  public datePickerEnabled = true;

  /** If true, touch optimized mode of date picker is enabled. */
  @Input()
  public datePickerTouchUi = false;

  /** Emits date upon internal date change. */
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
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get date(): Date {
    return this._date;
  }

  @Input()
  public set date(date: Date) {
    this._date = date;
    this.dateChange.emit(date);
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public previousDay(): void {
    const yesterday = new Date(this.date.getTime());
    yesterday.setDate(this.date.getDate() - 1);
    this.date = yesterday;
  }

  public nextDay(): void {
    const tomorrow = new Date(this.date.getTime());
    tomorrow.setDate(this.date.getDate() + 1);
    this.date = tomorrow;
  }

  public today(): void {
    this.date = new Date();
  }

  public onDatepickerInputChange(event: MatDatepickerInputEvent<Date>): void {
    this.logger.debug('Datepicker Input has changed: ' + event.value);
    this.date = event.value;
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

}
