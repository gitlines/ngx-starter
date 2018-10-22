import { Observable, BehaviorSubject } from 'rxjs';

export class CardDropEvent<T, D = any> {
  constructor (
    public readonly fromStack: CardStack<T, D>,
    public readonly toStack: CardStack<T, D>,
    public readonly card: T,
    public readonly copy: boolean
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
  private _connectedStacks: string[] = [];


  private _sort: (a: T, b: T) => number;


  /***************************************************************************
   *                                                                         *
   * Static Builder                                                          *
   *                                                                         *
   **************************************************************************/

  public static newStack<T>(id: string, title: string, connectedStacks?: string[], initialCards?: T[]): CardStack<T>  {
    return new CardStack(id, title, connectedStacks, null, initialCards);
  }

  public static newStackData<T, D>(id: string, title: string, stackData: D,
                                   connectedStacks?: string[], initialCards?: T[]): CardStack<T, D>  {
    return new CardStack(id, title, connectedStacks, null, initialCards);
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
   * @param connectedStacks Connected stacks for drag / drop
   * @param initialCards Initial card data
   */
  constructor(
    id: string,
    title: string,
    connectedStacks?: string[],
    data?: D,
    initialCards?: T[],
  ) {
    this._id = id;
    this._data = data;
    this._title = title;
    this._cards = new BehaviorSubject<T[]>(initialCards ? initialCards : []);
    this.connectedStackIds = connectedStacks ? connectedStacks : [];
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
   * Gets all stack-ids which are connected to this one for drag-drop.
   */
  public get connectedStackIds(): string[] {
    return this._connectedStacks;
  }

  /**
   * Sets all stack-ids which are connected to this one for drag-drop.
   */
  public set connectedStackIds(ids: string[]) {
    this._connectedStacks = ids;
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
