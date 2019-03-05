import {Component, ContentChildren, Input, OnInit, Output, QueryList} from '@angular/core';
import {EbsSelectListComponent} from '../ebs-select-list/ebs-select-list.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'ebs-select-list-item',
  templateUrl: './ebs-select-list-item.component.html',
  styleUrls: ['./ebs-select-list-item.component.scss'],
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
export class EbsSelectListItemComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  @Input()
  public value: any;

  @ContentChildren(EbsSelectListItemComponent)
  public children: QueryList<EbsSelectListItemComponent>;

  public isOpen = false;

  private readonly _itemClickSubject = new Subject<any>();

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private selectListComponent: EbsSelectListComponent
  ) { }

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

  public get hasChildren(): boolean {
    return this.children && this.children.length > 1;
  }

  public get isActive(): boolean {
    return this.selectListComponent.isActive(this.value);
  }

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

    if (this.hasChildren) {
      this.toggle();
    } else {
      this.selectListComponent.value = this.value;
    }
  }

  public toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
