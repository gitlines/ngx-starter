import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardStack } from '../card-stack';
import {Observable} from 'rxjs/internal/Observable';
import {first} from 'rxjs/operators';

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

  // Templates

  @Input()
  public cardTemplate: any;

  @Input()
  public canCollapse = false;

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

}
