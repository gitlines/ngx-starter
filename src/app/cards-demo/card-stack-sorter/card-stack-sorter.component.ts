import { Component, OnInit } from '@angular/core';
import {CardStack} from '../../../../projects/elderbyte/ngx-starter/src/lib/components/card-organizer/card-stack';

@Component({
  selector: 'starter-demo-card-stack-sorter',
  templateUrl: './card-stack-sorter.component.html',
  styleUrls: ['./card-stack-sorter.component.scss']
})
export class CardStackSorterComponent implements OnInit {

  public stack: CardStack<string>;


  constructor() { }

  ngOnInit() {

    this.stack = CardStack.newStack('', '', [
      'one',
      'two',
      'three'
    ]);

  }

}
