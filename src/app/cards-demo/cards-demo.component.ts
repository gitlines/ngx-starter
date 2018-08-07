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
      link => link.relationshipType,
      [
        new CardStack('a', 'A', [
          '1',
          '2',
          '2',
          '2',
          '2',
          '2',
          '2',
          '2',
        ]),
        new CardStack('a', 'B'),
        new CardStack('a', 'C'),
        new CardStack('a', 'D'),
      ]
    );

  }

}
