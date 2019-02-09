import {Component, ContentChildren, Input, OnInit, QueryList} from '@angular/core';
import {EbsSelectListComponent} from '../ebs-select-list/ebs-select-list.component';
import {animate, state, style, transition, trigger} from '@angular/animations';

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

  @Input()
  public value: any;

  @ContentChildren(EbsSelectListItemComponent)
  public children: QueryList<EbsSelectListItemComponent>;

  public isOpen = false;

  constructor(
    private selectListComponent: EbsSelectListComponent
  ) { }

  public ngOnInit(): void {

  }

  public get hasChildren(): boolean {
    return this.children && this.children.length > 1;
  }

  public get isActive(): boolean {
    return this.selectListComponent.value === this.value;
  }

  public activate(event: Event): void {
    if (this.hasChildren) {
      this.isOpen = !this.isOpen;
    }
    this.selectListComponent.value = this.value;
  }
}
