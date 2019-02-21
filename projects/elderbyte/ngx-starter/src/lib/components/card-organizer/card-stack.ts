import { Observable, BehaviorSubject } from 'rxjs';
import {moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

export class CardDropEvent<T, D = any> {
  constructor (
    /**
     * fromStack The stack where the card originated from
     */
    public readonly fromStack: CardStack<T, D>,

    /**
     * toStack The stack where the card is dropped to
     */
    public readonly toStack: CardStack<T, D>,
    /**
     * card The card domain model
     */
    public readonly card: T,
    /**
     * copy Should the item being moved (copy = false) or duplicated (copy=true).
     */
    public readonly copy: boolean,
    /**
     *  fromIndex Index of the item when it was picked up fromStack.
     */
    public readonly fromIndex: number,
    /**
     * toIndex Current index of the item in toStack.
     */
    public readonly toIndex: number,
    /**
     * isPointerOverContainer Whether the user's pointer was over the container when the item was dropped.
     */
    public readonly isPointerOverContainer: boolean
  ) { }
}


/**
 * Represents a card stack model.
 *
 * D: Type of the attached stack data
 * T: Type of the attached card data
 */
export class CardStack<T, D = any> {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly _id: string;
  private readonly _cards: BehaviorSubject<T[]>;
  private readonly _collapsed = new BehaviorSubject<boolean>(false);

  private _title: string;
  private _data: D;

  private _sort: (a: T, b: T) => number;


  /***************************************************************************
   *                                                                         *
   * Static Builder                                                          *
   *                                                                         *
   **************************************************************************/

  public static newStackSimple<T>(initialCards?: T[]): CardStack<T>  {
    return new CardStack(
      'id-' + Math.floor((Math.random() * 6) + 1),
      '',
      null,
      initialCards
    );
  }

  public static newStack<T>(id: string, title: string, initialCards?: T[]): CardStack<T>  {
    return new CardStack(id, title, null, initialCards);
  }

  public static newStackData<T, D>(id: string, title: string,
                                   stackData: D, initialCards?: T[]): CardStack<T, D>  {
    return new CardStack(id, title, stackData, initialCards);
  }

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  /**
   * Creates a new card stack model
   *
   * @param id The unique stack id
   * @param title The display title of this stack
   * @param data Custom data attached to this stack
   * @param initialCards Initial card data
   */
  constructor(
    id: string,
    title: string,
    data?: D,
    initialCards?: T[],
  ) {
    this._id = id;
    this._data = data;
    this._title = title;
    this._cards = new BehaviorSubject<T[]>(initialCards ? initialCards : []);
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Gets the id of this stack.
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Gets the custom data attached to this stack.
   */
  public get data(): D {
    return this._data;
  }

  /**
   * Attach custom data to this stack.
   */
  public set data(data: D) {
    this._data = data;
  }

  /**
   * Gets the display title of this stack
   */
  public get title(): string {
    return this._title;
  }

  /**
   * Sets the display title of this stack
   */
  public set title(title: string) {
    this._title = title;
  }

  /**
   * Observable stream of the current cards in this stack
   */
  public get cards(): Observable<T[]> {
    return this._cards.asObservable();
  }

  public get cardsSnapshot(): T[] {
    return [...this._cards.getValue()];
  }

  public get collapsed(): Observable<boolean> {
    return this._collapsed.asObservable();
  }

  public set isCollapsed(state: boolean) {
    this._collapsed.next(state);
  }

  public get isCollapsed(): boolean {
    return this._collapsed.getValue();
  }

  public set sort(sortFn: ((a: T, b: T) => number)) {
    this._sort = sortFn;
  }

  public get sort(): ((a: T, b: T) => number) {
    return this._sort;
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public clear() {
    this.replaceCards([]);
  }

  public replaceCards(newCards: T[]): void {

    if (this._sort) {
      newCards.sort(this._sort);
    }

    this._cards.next(newCards);
  }

  public addCard(card: T, desiredIndex?: number): void {
    const cards = this.cardsSnapshot;
    if (desiredIndex === undefined || desiredIndex === null) {
      cards.push(card);
    } else {
      const dummy = [card];
      transferArrayItem(dummy, cards, 0, desiredIndex);
    }
    this.replaceCards(cards);
  }

  public removeCard(card: T): void {
    this.replaceCards(this.cardsSnapshot.filter(c => c !== card));
  }

  public moveCard(fromIndex: number, toIndex: number): void {
    const snapshot = this.cardsSnapshot;
    moveItemInArray(snapshot, fromIndex, toIndex);
    this.replaceCards(snapshot);
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

}
