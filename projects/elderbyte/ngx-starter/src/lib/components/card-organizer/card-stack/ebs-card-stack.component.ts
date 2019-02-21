import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CardDropEvent, CardStack} from '../card-stack';
import {Observable} from 'rxjs/internal/Observable';
import {first} from 'rxjs/operators';
import {CdkDrag, CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDropList} from '@angular/cdk/drag-drop';
import {LoggerFactory} from '@elderbyte/ts-logger';

@Component({
  selector: 'ebs-card-stack',
  templateUrl: './ebs-card-stack.component.html',
  styleUrls: ['./ebs-card-stack.component.scss']
})
export class EbsCardStackComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('EbsCardStackComponent');

  @Input()
  public stack: CardStack<any, any>;

  @Input()
  public removeConfirmation: (card: any) => Observable<boolean>;

  @Output('requestNewCard')
  public readonly requestNewCard = new EventEmitter<CardStack<any, any>>();

  @Output('requestRemoveCard')
  public readonly requestRemoveCard = new EventEmitter<any>();

  @Output('cardClick')
  public readonly cardClick = new EventEmitter<any>();

  @Output('cardDropped')
  public readonly cardDropped = new EventEmitter<CardDropEvent<any, any>>();

  @Input()
  public canEnterPredicate: (card: any, stack: CardStack<any, any>) => boolean;

  @Input()
  public connectedTo: string[] = [];

  /**
   * If enabled, the card stack will
   * automatically handle card drag & drops
   * and move card from one stack to another and move
   * them inside a stack.
   */
  @Input()
  public autoMoveCards = false;

  // Templates

  @Input()
  public cardTemplate: any;

  @Input()
  public canCollapse = false;

  @Input()
  public copyOnDrag = false;

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

  public ngOnInit(): void  {

  }

  /***************************************************************************
   *                                                                         *
   * Public API Drag & Drop                                                  *
   *                                                                         *
   **************************************************************************/

  public cardEntered(event: CdkDragEnter<any>): void {
    // this.logger.debug('Drag enter:', event);
  }

  public cardExited(event: CdkDragExit<any>): void {
    // this.logger.debug('Drag exit', event);
  }

  public cardDrop(event: CdkDragDrop<CardStack<any, any>>): void {

    const cardDrop = new CardDropEvent(
      event.previousContainer.data,
      event.container.data,
      event.item.data,
      this.copyOnDrag,
      event.previousIndex,
      event.currentIndex,
      event.isPointerOverContainer
    );

    if (this.autoMoveCards) {
      this.handleCardDrop(cardDrop); // TODO Make configurable or disable when custom sort is enabled?
    }

    this.cardDropped.next(cardDrop);
  }

  public get enterPredicate(): (drag: CdkDrag<any>, drop: CdkDropList<any>) => boolean {
    return (drag: CdkDrag<any>, drop: CdkDropList<any>)  => {
      if (this.canEnterPredicate) {
       return this.canEnterPredicate(drag.data, drop.data);
      }
      return true;
    };
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/


  public onRequestNewCard(event: MouseEvent): void {
    this.requestNewCard.next(this.stack);
  }

  public onRequestRemoveCard(event: MouseEvent, card: any): void {

    if (event) {
      event.stopPropagation();
    }


    if (this.removeConfirmation !== undefined) {

      this.removeConfirmation(card).pipe(first())
        .subscribe(
          confirmed => {
            if (confirmed) { this.removeCard(card); }
          });

    } else {
      this.removeCard(card);
    }

  }

  public onCardSelected(event: MouseEvent, card: any): void {
    this.cardClick.next(card);
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  private removeCard(card: any): void {
    this.stack.removeCard(card);
    this.requestRemoveCard.next(card);
  }

  /**
   * React to drag and drop events -
   * will move cards between stacks and sort them if possible.
   * @param cardDrop
   */
  private handleCardDrop(cardDrop: CardDropEvent<any, any>): void {
    if (cardDrop.fromStack === cardDrop.toStack
      && cardDrop.toStack === this.stack) {

      // Drag & Drop inside the same stack -> sort

      if (!this.stack.sort) {
        // Only allow manual sort when the user did not provide
        // a general sort function
        this.stack.moveCard(cardDrop.fromIndex, cardDrop.toIndex);
      }
    } else {

      // Dropped Card from another stack

      if (!cardDrop.copy) {
        cardDrop.fromStack.removeCard(cardDrop.card);
      }
      cardDrop.toStack.addCard(cardDrop.card, cardDrop.toIndex);
    }
  }

}
