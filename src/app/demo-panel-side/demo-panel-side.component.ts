import { Component, OnInit } from '@angular/core';
import {SideContentService} from '../../../projects/elderbyte/ngx-starter/src/lib/features/side-content/side-content.service';

@Component({
  selector: 'starter-demo-panel-side',
  templateUrl: './demo-panel-side.component.html',
  styleUrls: ['./demo-panel-side.component.scss']
})
export class DemoPanelSideComponent implements OnInit {

  public expanded: boolean;

  constructor(
      private sideContentService: SideContentService
  ) { }

  ngOnInit() {
  }

  public close(event: Event): void {
    this.sideContentService.closeSideContent();
  }

}
