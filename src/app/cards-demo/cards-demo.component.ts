import { Component, OnInit } from '@angular/core';
import { CardOrganizerData, CardStack, CommonDialogService } from '@elderbyte/ngx-starter';
import { Observable } from 'rxjs';

@Component({
  selector: 'starter-demo-cards-demo',
  templateUrl: './cards-demo.component.html',
  styleUrls: ['./cards-demo.component.scss']
})
export class CardsDemoComponent implements OnInit {

  public cardData: CardOrganizerData<string, string>;

  constructor(
      private dialogService: CommonDialogService
  ) { }

  ngOnInit() {

    this.cardData = new CardOrganizerData<string, string>(
        (link: string) => link,
      [
        new CardStack('a', 'A', [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
        ]),
        new CardStack('b', 'B', [
          'a',
          'b',
        ]),
        new CardStack('c', 'C'),
        new CardStack('d', 'D'),
      ]
    );

  }


  public get confirmDeletion(): (() => Observable<boolean>) {
      return this.confirmDeletionFunc.bind(this);
  }

    private confirmDeletionFunc(): Observable<boolean> {

        return this.dialogService.showConfirm({
            title: 'dialogs.confirm.title',
            message: 'dialogs.confirm.message'
        });
    }

}
