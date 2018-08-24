import { Component, OnInit } from '@angular/core';
import {CardOrganizerData, CardStack} from '@elderbyte/ngx-starter';

@Component({
  selector: 'starter-demo-cards-demo',
  templateUrl: './cards-demo.component.html',
  styleUrls: ['./cards-demo.component.scss']
})
export class CardsDemoComponent implements OnInit {

  public cardData: CardOrganizerData<string, string>;

  constructor() { }

  ngOnInit() {

    this.cardData = new CardOrganizerData<string, string>(
      link => link,
      [
        new CardStack('a', 'A', [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
        ]),
        new CardStack('b', 'B', [
          'a',
          'b',
        ]),
        new CardStack('c', 'C'),
        new CardStack('d', 'D'),
      ]
    );

  }

}
