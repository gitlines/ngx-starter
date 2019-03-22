import {ChangeDetectionStrategy, Component, ContentChildren, OnInit, Output, QueryList} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ElderNavLinkComponent} from '../nav-link/elder-nav-link.component';
import {BehaviorSubject, Observable, Subject} from 'rxjs';


interface EbsNavGroupState {
  isOpen: boolean;
}

@Component({
  selector: 'elder-nav-group, ebs-nav-group',
  templateUrl: './elder-nav-group.component.html',
  styleUrls: ['./elder-nav-group.component.scss'],
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
export class ElderNavGroupComponent implements OnInit {


  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  @ContentChildren(ElderNavLinkComponent)
  public children: QueryList<ElderNavLinkComponent>;

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
