import { Component, OnInit} from '@angular/core';
import { EbsSideContentService } from '@elderbyte/ngx-starter';

@Component({
  selector: 'starter-demo-panel-side',
  templateUrl: './demo-panel-side.component.html',
  styleUrls: ['./demo-panel-side.component.scss']
})
export class DemoPanelSideComponent implements OnInit {

  public expanded: boolean;

  constructor(
      private sideContentService: EbsSideContentService
  ) { }

  ngOnInit() {
  }

  public close(event: Event): void {
    this.sideContentService.closeSideContent();
  }

}
