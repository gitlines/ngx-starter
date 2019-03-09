import {ChangeDetectionStrategy, Component, ContentChildren, OnInit, Output, QueryList} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {EbsNavLinkComponent} from '../nav-link/ebs-nav-link.component';
import {BehaviorSubject, Observable, Subject} from 'rxjs';


interface EbsNavGroupState {
  isOpen: boolean;
}

@Component({
  selector: 'ebs-nav-group',
  templateUrl: './ebs-nav-group.component.html',
  styleUrls: ['./ebs-nav-group.component.scss'],
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbsNavGroupComponent implements OnInit {


  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  @ContentChildren(EbsNavLinkComponent)
  public children: QueryList<EbsNavLinkComponent>;

  public readonly state$ = new BehaviorSubject<EbsNavGroupState>({ isOpen: false });

  private readonly _itemClickSubject = new Subject<any>();

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
    this._itemClickSubject.next();
    this.toggle();
  }

  public toggle(): void {
    const myState = this.state$.getValue();
    this.state$.next({ isOpen: !myState.isOpen });
  }
}
