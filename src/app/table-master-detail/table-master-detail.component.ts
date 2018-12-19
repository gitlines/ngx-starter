import { Component, OnInit } from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {Food} from '../model/food';
import {IDataContextActivePage, DataContextBuilder} from '@elderbyte/ngx-starter';

@Component({
  selector: 'starter-demo-table-master-detail',
  templateUrl: './table-master-detail.component.html',
  styleUrls: ['./table-master-detail.component.scss']
})
export class TableMasterDetailComponent implements OnInit {

  private readonly logger = LoggerFactory.getLogger('TableMasterDetailComponent');

  private foods = [
    new Food('Bread', 45.53),
    new Food('Apple', 86.53),
    new Food('Milk', 34),
    new Food('Meat', 42),
    new Food('Fish', 12),

    new Food('Bread 2', 45.53),
    new Food('Apple 2', 86.53),
    new Food('Milk 2', 34),
    new Food('Meat 2', 42),
    new Food('Fish 2', 12),

    new Food('Bread 3', 45.53),
    new Food('Apple 3', 86.53),
    new Food('Milk 3', 34),
    new Food('Meat 3', 42),
    new Food('Fish 3', 12)
  ];

  public data: IDataContextActivePage<Food>;

  constructor() { }

  public ngOnInit(): void {
    this.data = DataContextBuilder.start<Food>()
      .pageSize(5)
      .buildLocalActivePaged(this.foods);

    this.data.start();
  }

}
