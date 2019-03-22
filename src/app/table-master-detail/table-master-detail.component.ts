import { Component, OnInit } from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {Food, FoodStore} from '../model/food';
import {Router} from '@angular/router';
import {ElderToastService, ElderRouterOutletService} from '@elderbyte/ngx-starter';

@Component({
  selector: 'starter-demo-table-master-detail',
  templateUrl: './table-master-detail.component.html',
  styleUrls: ['./table-master-detail.component.scss']
})
export class TableMasterDetailComponent implements OnInit {

  private readonly logger = LoggerFactory.getLogger('TableMasterDetailComponent');


  public data: Food[];

  constructor(
    private router: Router,
    private toastService: ElderToastService,
    private outletService: ElderRouterOutletService
  ) { }

  public ngOnInit(): void {
    this.data = FoodStore.foods;
   // this.data.start();
  }

  public openDetail(food: Food): void {
    if (food.name === 'Apple') {
      // this.router.navigate([{outlets: {'side': ['simple']}}]);
      this.outletService.activate('side', ['simple']);
    } else {
      // this.router.navigate([{outlets: {'side': ['foods', food.name]}}]);
      this.outletService.activate('side', ['foods', food.name]);
    }
  }

  public deleteRow(food: Food): void {
    this.toastService.pushInfo('Dont delete ' + food.name + '! :-P');
  }

}
