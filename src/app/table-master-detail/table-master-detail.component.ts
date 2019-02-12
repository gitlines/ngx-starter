import { Component, OnInit } from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {Food, FoodStore} from '../model/food';
import {Router} from '@angular/router';

@Component({
  selector: 'starter-demo-table-master-detail',
  templateUrl: './table-master-detail.component.html',
  styleUrls: ['./table-master-detail.component.scss']
})
export class TableMasterDetailComponent implements OnInit {

  private readonly logger = LoggerFactory.getLogger('TableMasterDetailComponent');


  public data: Food[];

  constructor(
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.data = FoodStore.foods;
   // this.data.start();
  }

  public openDetail(food: Food): void {
    if (food.name === 'Apple') {
      this.router.navigate([{outlets: {'side': ['simple']}}]);
    } else {
      this.router.navigate([{outlets: {'side': ['foods', food.name]}}]);
    }
  }

}
