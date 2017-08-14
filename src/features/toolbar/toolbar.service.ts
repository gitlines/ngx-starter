
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


export class ToolbarHeader {
  constructor(
    public name: string) {
  }
}


@Injectable()
export class ToolbarService {

  private _titleChange: BehaviorSubject<ToolbarHeader>;
  private _title: ToolbarHeader;

  constructor() {
    this._title = new ToolbarHeader('Home');
    this._titleChange = new BehaviorSubject<ToolbarHeader>(this._title);
  }

  public set title(title: ToolbarHeader){
    this._title = title;
    this._titleChange.next(title);
  }

  public get title(): ToolbarHeader{
    return this._title;
  }

  public get titleChange(): Observable<ToolbarHeader> {
    return this._titleChange;
  }

}
