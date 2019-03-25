import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'elder-card-panel',
  templateUrl: './elder-card-panel.component.html',
  styleUrls: ['./elder-card-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElderCardPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
