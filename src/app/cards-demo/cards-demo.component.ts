import { Component, OnInit } from '@angular/core';
import { CardOrganizerData, CardStack, EbsCommonDialogService, CardDropEvent, EbsToastService } from '@elderbyte/ngx-starter';
import { Observable } from 'rxjs';
import {LoggerFactory} from '@elderbyte/ts-logger';


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
      private dialogService: EbsCommonDialogService,
      private toastService: EbsToastService
  ) { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {

    this.cardData = new CardOrganizerData<string>(
      [
          CardStack.newStack(Status.Backlog, 'Backlog'),
          CardStack.newStack(Status.ToDo, 'ToDo'),
          CardStack.newStack(Status.Doing, 'Doing'),
          CardStack.newStack(Status.Done, 'Done'),
        ]// (a, b) => a > b ? 1 : -1
    );

    this.cardData.replaceStackCards( Status.Backlog, [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
        ]
      );


    this.cardData.replaceStackCards(Status.ToDo,
      [
        'a',
        'b',
      ],
    );

  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public get canEnter(): (card: string, stack: CardStack<string>) => boolean {
    return (card: string, stack: CardStack<string>) => {
      return stack.id !== Status.Done;
    };
  }

  public myCardDropped(event: CardDropEvent<string>): void {

    this.logger.info('Card Dropped', event);

    this.toastService.pushInfo(
      'Card moved from ' + event.fromStack.data + ' (' + event.fromIndex +
      ') to stack ' + event.toStack.data + ' (' + event.toIndex + ')!');
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

    /**/
      return this.dialogService.showConfirm({
          title: 'dialogs.confirm.title',
          message: 'dialogs.confirm.message',
          interpolateParams: {
            type: 'actions.ok'
          }
      });

    /*
    return this.dialogService.showConfirm({
      title: 'dialogs.confirm.title',
      message: 'dialogs.confirm.message'
    });
    */
  }

}
