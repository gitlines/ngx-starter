
import {Component, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';


@Component({
  selector: 'ebs-expand-toggle-button',
  templateUrl: './ebs-expand-toggle-button.component.html'
})
export class EbsExpandToggleButtonComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private _expanded: boolean;
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


  /**
   * @deprecated Please switch to standard 'expandedChange' output event
   */
  @Output('changed')
  public get expandedChangeDeprecated(): Observable<boolean> {
    return this._expandedChange.asObservable();
  }


  @Output()
  public get expandedChange(): Observable<boolean> {
    return this._expandedChange.asObservable();
  }

  public get expanded(): boolean {
    return this._expanded;
  }

  @Input()
  public set expanded(value: boolean) {
    this._expanded = value;
    this._expandedChange.next(value);
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
