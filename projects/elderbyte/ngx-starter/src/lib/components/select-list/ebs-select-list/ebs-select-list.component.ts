import {Component, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {skip} from 'rxjs/operators';

@Component({
  selector: 'ebs-select-list',
  templateUrl: './ebs-select-list.component.html',
  styleUrls: ['./ebs-select-list.component.scss']
})
export class EbsSelectListComponent implements OnInit {

  private readonly _valueChange = new BehaviorSubject<any>(null);

  constructor() { }

  ngOnInit() {

  }

  @Output()
  public get valueChange(): Observable<any> {
    return this._valueChange.pipe(
      skip(1)
    );
  }

  public get value(): string {
    return this._valueChange.value;
  }

  @Input()
  public set value(value: string) {
    this._valueChange.next(value);
  }

}
