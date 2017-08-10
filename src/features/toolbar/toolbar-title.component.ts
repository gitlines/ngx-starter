
import {Component, OnDestroy, OnInit} from "@angular/core";
import {ToolbarService} from "./toolbar.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'toolbar-title',
  templateUrl: './toolbar-title.component.html',
  styleUrls: ['./toolbar-title.component.scss']
})
export class ToolbarTitleComponent implements OnInit, OnDestroy {

  public title : string;
  private _sub : Subscription;

  constructor(
    private toolbarService : ToolbarService
  ){

  }

  ngOnInit(): void {
    this._sub = this.toolbarService.titleChange
      .subscribe(title => this.title = title.name);
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
