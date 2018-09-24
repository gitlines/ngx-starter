import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'starter-demo-eatable-category-list',
  templateUrl: './eatable-category-list.component.html',
  styleUrls: ['./eatable-category-list.component.scss']
})
export class EatableCategoryListComponent implements OnInit {

  private categories = ['fruits', 'sweets', 'meat'];

  constructor() { }

  ngOnInit() {
  }

}
