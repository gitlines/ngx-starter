import { Component, OnInit } from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {Food, FoodStore} from '../model/food';
import {IDataContextActivePage, DataContextBuilder} from '@elderbyte/ngx-starter';

@Component({
  selector: 'starter-demo-table-master-detail',
  templateUrl: './table-master-detail.component.html',
  styleUrls: ['./table-master-detail.component.scss']
})
export class TableMasterDetailComponent implements OnInit {

  private readonly logger = LoggerFactory.getLogger('TableMasterDetailComponent');


  public data: IDataContextActivePage<Food>;

  constructor() { }

  public ngOnInit(): void {
    this.data = DataContextBuilder.start<Food>()
      .pageSize(5)
      .buildLocalActivePaged(FoodStore.foods);

    this.data.start();
  }

}
