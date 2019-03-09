import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';


@Component({
  selector: 'ebs-nav-list',
  templateUrl: './ebs-nav-list.component.html',
  styleUrls: ['./ebs-nav-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbsNavListComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
