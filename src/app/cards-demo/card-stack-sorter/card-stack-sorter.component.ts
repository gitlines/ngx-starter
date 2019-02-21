import {Component, OnDestroy, OnInit} from '@angular/core';
import {CardStack} from '../../../../projects/elderbyte/ngx-starter/src/lib/components/card-organizer/card-stack';
import {Subscription} from 'rxjs';


export class SampleCard {
  constructor(
    public title: string,
    public value: number
  ) { }
}

@Component({
  selector: 'starter-demo-card-stack-sorter',
  templateUrl: './card-stack-sorter.component.html',
  styleUrls: ['./card-stack-sorter.component.scss']
})
export class CardStackSorterComponent implements OnInit, OnDestroy {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private _sub: Subscription;

  public stack: CardStack<SampleCard>;
  public currentOrder: string;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor() { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {
    this.stack = CardStack.newStackSimple([
      new SampleCard('one', 1),
      new SampleCard('two', 2),
      new SampleCard('three', 3),
      new SampleCard('four', 4),
      new SampleCard('five', 5),
    ]);

    this._sub = this.stack.cards.subscribe(
      cards => this.updateCurrentOrder(cards)
    );

    this.updateCurrentOrder(this.stack.cardsSnapshot);
  }

  public ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private updateCurrentOrder(cards: SampleCard[]): void {
    this.currentOrder = cards.map(c => c.title).join('-');
  }

}
