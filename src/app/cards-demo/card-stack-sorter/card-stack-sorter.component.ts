import {Component, OnDestroy, OnInit} from '@angular/core';
import {CardStack} from '../../../../projects/elderbyte/ngx-starter/src/lib/components/card-organizer/card-stack';
import {Subscription} from 'rxjs';


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

  public stack: CardStack<string>;
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
      'one',
      'two',
      'three',
      'four',
      'five',
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

  private updateCurrentOrder(cards: string[]): void {
    this.currentOrder = cards.join('-');
  }



}
