import { Component, OnInit } from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {Food, FoodStore} from '../model/food';
import {IDataContextActivePage, DataContextBuilder} from '@elderbyte/ngx-starter';
import {Router} from '@angular/router';

@Component({
  selector: 'starter-demo-table-master-detail',
  templateUrl: './table-master-detail.component.html',
  styleUrls: ['./table-master-detail.component.scss']
})
export class TableMasterDetailComponent implements OnInit {

  private readonly logger = LoggerFactory.getLogger('TableMasterDetailComponent');


  public data: IDataContextActivePage<Food>;

  constructor(
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.data = DataContextBuilder.start<Food>()
      .pageSize(5)
      .buildLocalActivePaged(FoodStore.foods);

    this.data.start();
  }

  public openDetail(food: Food): void {
    this.router.navigate([{outlets: {'side': ['foods', food.name]}}]);
    // this.router.navigate([{outlets: {'side': ['simple']}}]);
  }

}
