import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'starter-demo-select-list-demo',
  templateUrl: './select-list-demo.component.html',
  styleUrls: ['./select-list-demo.component.scss']
})
export class SelectListDemoComponent implements OnInit {


  public items = ['one', 'two', 'three', 'four', 'five', 'six'];

  public currentValue: string;


  constructor() { }

  ngOnInit() {
    this.currentValue = this.items[0];
  }

}
