import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ebs-nav-link',
  templateUrl: './ebs-nav-link.component.html',
  styleUrls: ['./ebs-nav-link.component.scss']
})
export class EbsNavLinkComponent implements OnInit {

  @HostBinding('attr.tabindex') tabIndex = -1;

  @Input()
  public title: string;

  @Input()
  public routerLink: string;

  @Input()
  public icon: string;

  @Input()
  public fontIcon: string;

  @Input()
  public fontSet: string;

  @Input()
  public svgIcon: string;

  constructor() { }

  ngOnInit() {
  }

}
