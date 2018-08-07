import { CardStack } from './card-stack';
import { Observable, BehaviorSubject } from 'rxjs';
import {CollectionUtil} from '../../common/utils/collection-util';

/**
 * Represents the data-model of a data driven card organizer.
 *
 * This component organizes cards in card-stacks.
 *
 */
export class CardOrganizerData<G, T> {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly _stacks: BehaviorSubject<CardStack<G, T>[]>;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private readonly _groupGetter: ((T) => G),
    initialStacks?: CardStack<G, T>[],
    sort?: ((a: T, b: T) => number)
  ) {
    this._stacks = new BehaviorSubject<CardStack<G, T>[]>(initialStacks ? initialStacks : []);
    this.sort = sort;
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get stacks(): Observable<CardStack<G, T>[]> {
      return this._stacks.asObservable();
  }

  public get stacksSnapshot(): CardStack<G, T>[] {
    return this._stacks.getValue();
  }

  public set sort(sort: ((a: T, b: T) => number)) {
    this.stacksSnapshot.forEach(s => s.sort = sort);
  }

  public set cards (cards: T[]) {

    const grouped = CollectionUtil.groupByKey<G, T>(cards, this._groupGetter);

    this.stacksSnapshot.forEach(stack => {
      const newData = grouped.get(stack.group);
      if (newData) {
        stack.replaceCards(newData);
      } else {
        stack.clear();
      }
    });
  }

  public get cards(): T[] {
    const cards: T[] = [];
    this.stacksSnapshot.forEach(stack => cards.push(...stack.cardsSnapshot));
    return cards;
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public addCard(card: T): void {
    const group = this._groupGetter(card);
    const stack = this.findStack(group);
    stack.addCard(card);
  }

  public findStack(group: G): CardStack<G, T> {
    return this._stacks.getValue().find(s => s.group === group);
  }

}

