import {ChangeDetectionStrategy, Component, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {skip} from 'rxjs/operators';

@Component({
  selector: 'elder-select-list, ebs-select-list',
  templateUrl: './elder-select-list.component.html',
  styleUrls: ['./elder-select-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElderSelectListComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly _valueChange = new BehaviorSubject<any>(null);

  /**
   * Function to compare the option values with the selected values. The first argument
   * is a value from an item option. The second is the current value.
   */
  @Input()
  public compareWith: (o1: any, o2: any) => boolean;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor() { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {

  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Emits when the value changes.
   */
  @Output()
  public get valueChange(): Observable<any> {
    return this._valueChange.pipe(
      skip(1)
    );
  }

  /**
   * Sets the current selected value
   */
  @Input()
  public set value(value: string) {
    this._valueChange.next(value);
  }

  /**
   * Gets the current selected value
   */
  public get value(): string {
    return this._valueChange.value;
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public isActive(value: any): boolean {
    if (this.compareWith) {
      return this.compareWith(value, this.value);
    } else {
      return value === this.value;
    }
  }

}
