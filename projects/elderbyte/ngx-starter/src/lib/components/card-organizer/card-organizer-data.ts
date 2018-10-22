import { CardStack } from './card-stack';
import { Observable, BehaviorSubject } from 'rxjs';
import {CollectionUtil} from '../../common/utils/collection-util';

/**
 * Represents the data-model of a data driven card organizer.
 *
 * This component organizes cards in card-stacks.
 *
 */
export class CardOrganizerData<T, D = any> {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly _stacks: BehaviorSubject<CardStack<T, D>[]>;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    initialStacks?: CardStack<T, D>[],
    sort?: ((a: T, b: T) => number)
  ) {
    this._stacks = new BehaviorSubject<CardStack<T, D>[]>(initialStacks ? initialStacks : []);
    this.sort = sort;
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get stacks(): Observable<CardStack<T, D>[]> {
      return this._stacks.asObservable();
  }

  public get stacksSnapshot(): CardStack<T, D>[] {
    return this._stacks.getValue();
  }

  public set sort(sort: ((a: T, b: T) => number)) {
    this.stacksSnapshot.forEach(s => s.sort = sort);
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

  /**
   * Adds the given card to the stack with the given id.
   * @param card The card data
   * @param stackId The stack id
   */
  public addCard(card: T, stackId: string): void {
    const stack = this.findStackById(stackId);
    if (stack) {
      stack.addCard(card);
    }
  }

  /**
   * Replaces all cards in the matching stacks, defined by the stack-id-getter
   * @param cards
   * @param stackIdGetter
   */
  public replaceStackCardsDynamic(cards: T[], stackIdGetter: ((item: T) => string)) {

    const grouped = CollectionUtil.groupByKey<string, T>(cards, stackIdGetter);

    this.stacksSnapshot.forEach(stack => {
      const newData = grouped.get(stack.id);
      if (newData) {
        stack.replaceCards(newData);
      } else {
        stack.clear();
      }
    });
  }

  /**
   * Replace all cards in the given stack with the new cards.
   * @param cards
   * @param stackId
   */
  public replaceStackCards(cards: T[], stackId: string) {
    const stack = this.findStackById(stackId);
    if (stack) {
      stack.replaceCards(cards);
    }
  }

  public findStackByData(data: D): CardStack<T, D> {
    return this._stacks.getValue().find(s => s.data === data);
  }

  public findStackById(id: string): CardStack<T, D> {
    return this._stacks.getValue().find(s => s.id === id);
  }

}

