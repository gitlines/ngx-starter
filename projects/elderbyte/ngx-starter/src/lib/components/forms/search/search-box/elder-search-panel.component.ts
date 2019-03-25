import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'elder-search-panel',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElderSearchPanelComponent {
  constructor() { }
}
