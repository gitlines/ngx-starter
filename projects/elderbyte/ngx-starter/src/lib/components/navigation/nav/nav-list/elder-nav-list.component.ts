import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';


@Component({
  selector: 'elder-nav-list, ebs-nav-list',
  templateUrl: './elder-nav-list.component.html',
  styleUrls: ['./elder-nav-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElderNavListComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
