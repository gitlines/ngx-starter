import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'starter-demo-eatable-category-detail',
  templateUrl: './eatable-category-detail.component.html',
  styleUrls: ['./eatable-category-detail.component.scss']
})
export class EatableCategoryDetailComponent implements OnInit {

  private eatableMap: Map<string, string[]> = new Map([['fruits', ['apple', 'pear', 'melon']], ['sweets', ['bon bon', 'twizzle']]]);

  public eatables: string[] = [];
  public category: string;

  constructor(
      private route: ActivatedRoute
  ) {
    this.category = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.eatables = this.eatableMap.get(this.category);
  }

}
