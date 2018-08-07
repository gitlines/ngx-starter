import { Observable, BehaviorSubject } from 'rxjs';


export class CardStack<G, T> {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly _cards: BehaviorSubject<T[]>;
  private readonly _collapsed = new BehaviorSubject<boolean>(false);

  private _sort: (a: T, b: T) => number;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    public readonly group: G,
    public title: string,
    initialCards?: T[]
  ) {
    this._cards = new BehaviorSubject<T[]>(initialCards ? initialCards : []);
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

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

  public addCard(card: T): void {
    const cards = [...this.cardsSnapshot, card];
    this.replaceCards(cards);
  }

  public removeCard(card: T): void {
    this.replaceCards(this.cardsSnapshot.filter(c => c !== card));
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

}
