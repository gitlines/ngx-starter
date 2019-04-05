import { Component, OnInit } from '@angular/core';
import { IDataContext, DataContextBuilder, Uuid, ContinuableListing} from '@elderbyte/ngx-starter';
import {of, throwError} from 'rxjs';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {Food, FoodStore} from '../model/food';


class FoodProperty {
  constructor(
    public name: string,
    public displayName: string
  ) { }
}


@Component({
  selector: 'starter-demo-table-demo',
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.scss']
})
export class TableDemoComponent implements OnInit {

  private readonly logger = LoggerFactory.getLogger('TableDemoComponent');


  public simpleDataContext: IDataContext<Food> = DataContextBuilder.start<Food>()
    .pageSize(5)
    .localSort()
    .buildLocalActivePaged(FoodStore.foods);

  public emptyDataContext = DataContextBuilder.start<Food>()
    .buildLocalActivePaged([]);


  public errorDataContext = DataContextBuilder.start<Food>()
    .buildPaged((pageable => throwError(new Error('Failed to load data!'))));

  public continuableDataContext = DataContextBuilder.start()
    .localSort()
    .buildContinuationToken(chunkRequest => {

      this.logger.debug('Serving dummy continuation listing', chunkRequest);

      const response = new ContinuableListing<Food>();
      response.chunkSize = 30;
      response.continuationToken = chunkRequest.nextContinuationToken;
      response.nextContinuationToken = Uuid.generate();
      response.hasMore = true;
      response.content = FoodStore.foods;

      return of(response);
    });



  public dynamicProperties: FoodProperty[] = [];


  constructor() { }

  public ngOnInit(): void {
    this.simpleDataContext.start();
    this.emptyDataContext.start();
    this.errorDataContext.start();
    this.continuableDataContext.start();
  }

  public onSelectionChange(selection: Food[]): void {
    console.log('selection changed:', selection);
  }

  public onItemClick(food: Food): void {
    console.log('item clicked:', food);
  }

  public toggleColumns(event: Event): void {
    if (this.dynamicProperties.length === 0) {
      this.dynamicProperties = [
        new FoodProperty('category', 'Category'),
        new FoodProperty('vegan', 'Vegan')
      ];
    } else {
      this.dynamicProperties = [];
    }

    console.log(this.dynamicProperties);
  }

}
