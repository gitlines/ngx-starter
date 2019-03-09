import {ChangeDetectionStrategy, Component, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';


@Component({
  selector: 'ebs-expand-toggle-button',
  templateUrl: './ebs-expand-toggle-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbsExpandToggleButtonComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly _expandedChange = new BehaviorSubject<boolean>(false);

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void { }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  @Output()
  public get expandedChange(): Observable<boolean> {
    return this._expandedChange.asObservable();
  }

  @Input()
  public set expanded(value: boolean) {
    this._expandedChange.next(value);
  }

  public get expanded(): boolean {
    return this._expandedChange.getValue();
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public onToggleExpand(event: any): void {
    this.expanded = !this.expanded;
  }
}
