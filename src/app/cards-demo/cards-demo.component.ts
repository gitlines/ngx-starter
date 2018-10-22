import { Component, OnInit } from '@angular/core';
import { CardOrganizerData, CardStack, CommonDialogService, CardDropEvent } from '@elderbyte/ngx-starter';
import { Observable } from 'rxjs';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {ComparatorBuilder} from '../../../projects/elderbyte/ngx-starter/src/lib/common/data/field-comparator';


export enum Status {
  Backlog = 'backlog',
  ToDo = 'todo',
  Doing = 'doing',
  Done = 'done'
}


@Component({
  selector: 'starter-demo-cards-demo',
  templateUrl: './cards-demo.component.html',
  styleUrls: ['./cards-demo.component.scss']
})
export class CardsDemoComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('CardsDemoComponent');

  public cardData: CardOrganizerData<string>;

  public count = 0;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
      private dialogService: CommonDialogService
  ) { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {

    this.cardData = new CardOrganizerData<string>(
      [
          CardStack.newStack(Status.Backlog, 'Backlog', [Status.ToDo]),
          CardStack.newStack(Status.ToDo, 'ToDo', [Status.Backlog, Status.Doing]),
          CardStack.newStack(Status.Doing, 'Doing', [Status.Done, Status.ToDo]),
          CardStack.newStack(Status.Done, 'Done', [Status.Doing]),
        ],
      (a, b) => a > b ? 1 : -1
    );

    this.cardData.replaceStackCards([
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
        ], Status.Backlog
      );


    this.cardData.replaceStackCards(
      [
        'a',
        'b',
      ], Status.ToDo
    );

  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/


  public myCardDropped(event: CardDropEvent<string>): void {

    this.logger.info('card dropped', event);

    event.fromStack.removeCard(event.card);
    event.toStack.addCard(event.card);
  }

  public createNewCard(event: CardStack<string>): void {
    event.addCard('new-' + ++this.count);
  }

  public get confirmDeletion(): (() => Observable<boolean>) {
      return this.confirmDeletionFunc.bind(this);
  }

  public cardClicked(card: any) {
      console.log('Card has been clicked!');
  }

  /***************************************************************************
   *                                                                         *
   * Private methdos                                                         *
   *                                                                         *
   **************************************************************************/

  private confirmDeletionFunc(): Observable<boolean> {

      return this.dialogService.showConfirm({
          title: 'dialogs.confirm.title',
          message: 'dialogs.confirm.message'
      });
  }

}
