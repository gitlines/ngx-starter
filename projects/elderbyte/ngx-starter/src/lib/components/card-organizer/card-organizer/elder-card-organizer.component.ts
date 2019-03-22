import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {CardOrganizerData} from '../card-organizer-data';
import {CardDropEvent, CardStack} from '../card-stack';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {Observable} from 'rxjs/internal/Observable';

@Directive({selector: '[elderStackCard], [ebsStackCard]'})
export class ElderStackCardDirective {
  constructor(
    public templateRef: TemplateRef<any>,
    public viewContainer: ViewContainerRef) { }
}


@Component({
  selector: 'elder-card-organizer, ebs-card-organizer',
  templateUrl: './elder-card-organizer.component.html',
  styleUrls: ['./elder-card-organizer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElderCardOrganizerComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderCardOrganizerComponent');

  private _organizerModel: CardOrganizerData<any, any>;

  public stacks$: Observable<CardStack<any, any>[]>;

  @Input()
  public canRemove = true;

  @Input()
  public removeConfirmation: (card: any) => Observable<boolean>;

  @Input()
  public copyOnDrag: boolean;

  /**
   * If enabled, the card organizer will
   * automatically handle card drag & drops
   * and move card from one stack to another and move
   * them inside a stack.
   */
  @Input()
  public autoMoveCards = false;

  @Input()
  public headerEnabled = true;

  @Input()
  public canEnterPredicate: (card: any, stack: CardStack<any, any>) => boolean;

  @Output('requestNewCard')
  public readonly requestNewCard = new EventEmitter<CardStack<any, any>>();

  @Output('requestRemoveCard')
  public readonly requestRemoveCard = new EventEmitter<any>();

  @Output('cardClick')
  public readonly cardClick = new EventEmitter<any>();

  @Output('cardDropped')
  public readonly cardDropped = new EventEmitter<CardDropEvent<any, any>>();

  @ContentChild(ElderStackCardDirective, {read: TemplateRef})
  public stackCardTemplate: TemplateRef<any>;



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

  public ngOnInit(): void {

  }

  @HostListener('document:keydown.shift', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.copyOnDrag = true;
  }

  @HostListener('document:keyup.shift', ['$event']) onKeyupHandler(event: KeyboardEvent) {
    this.copyOnDrag = false;
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get organizerModel(): CardOrganizerData<any, any> {
    return this._organizerModel;
  }

  @Input()
  public set organizerModel(value: CardOrganizerData<any, any>) {
    this._organizerModel = value;
    if (this._organizerModel) {
      this.stacks$ = this._organizerModel.stacks;
    } else {
      this.stacks$ = null;
    }
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public onRequestNewCard(stack: CardStack<any, any>): void {
      this.requestNewCard.next(stack);
  }

  public onRequestRemoveCard(cardToDelete: any): void {
      this.requestRemoveCard.next(cardToDelete);
  }

  public onCardClicked(clickedCard: any): void {
    this.cardClick.next(clickedCard);
  }

  public onCardDropped(event: CardDropEvent<any, any>): void {
    this.cardDropped.next(event);
  }

}
