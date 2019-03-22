import {AfterContentInit, Component, ContentChildren, Input, OnInit, Output, QueryList} from '@angular/core';
import {ElderSelectListComponent} from '../select-list/elder-select-list.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

interface ElderSelectListItemState { // Necessary for 'ngIf as'
  isActive: boolean;
}

@Component({
  selector: 'elder-select-list-item, ebs-select-list-item',
  templateUrl: './elder-select-list-item.component.html',
  styleUrls: ['./elder-select-list-item.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '*',
        opacity: 1,
      })),
      state('closed', style({
        height: 0,
        opacity: 0.5,
      })),
      transition('open => closed', [
        animate('200ms')
      ]),
      transition('closed => open', [
        animate('200ms')
      ]),
    ])
  ]
})
export class ElderSelectListItemComponent implements OnInit, AfterContentInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  @Input()
  public value: any;

  @ContentChildren(ElderSelectListItemComponent)
  public children: QueryList<ElderSelectListItemComponent>;

  public readonly isOpen$ = new BehaviorSubject<boolean>(false);

  public hasChildren$: Observable<boolean>;

  private readonly _itemClickSubject = new Subject<any>();

  public state$: Observable<ElderSelectListItemState>;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private selectListComponent: ElderSelectListComponent
  ) { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/


  public ngOnInit(): void {
    this.state$ = this.selectListComponent.valueChange.pipe(
      map(value => this.currentState()),
      startWith(this.currentState())
    );
  }

  public ngAfterContentInit(): void {
    this.hasChildren$ = this.children.changes.pipe(
      map(() => this.checkHasChildren()),
      startWith(this.checkHasChildren())
    );
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  @Output()
  public get click(): Observable<any> {
    return this._itemClickSubject.asObservable();
  }

  /***************************************************************************
   *                                                                         *
   * Public Api                                                              *
   *                                                                         *
   **************************************************************************/

  public itemClick(event: Event): void {

    this._itemClickSubject.next(this.value);

    if (this.checkHasChildren()) {
      this.toggle();
    } else {
      this.selectListComponent.value = this.value;
    }
  }

  public toggle(): void {
    this.isOpen$.next(!this.isOpen$.getValue());
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private currentState(): ElderSelectListItemState {
    return {
      isActive: this.selectListComponent.isActive(this.value)
    };
  }

  private checkHasChildren(): boolean {
    return this.children && this.children.length > 1;
  }

}
