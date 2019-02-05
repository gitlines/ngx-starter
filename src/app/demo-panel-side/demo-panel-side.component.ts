import { Component, OnInit} from '@angular/core';
import { EbsSideContentService } from '@elderbyte/ngx-starter';
import {Router} from '@angular/router';

@Component({
  selector: 'starter-demo-panel-side',
  templateUrl: './demo-panel-side.component.html',
  styleUrls: ['./demo-panel-side.component.scss']
})
export class DemoPanelSideComponent implements OnInit {

  public expanded: boolean;

  constructor(
      private router: Router,
      private sideContentService: EbsSideContentService
  ) { }

  ngOnInit() {
  }

  public close(event: Event): void {
    this.sideContentService.closeSideContent();
  }

  public navigate(): void {
    this.sideContentService.closeSideContent().then(
      () => this.router.navigate(['/app/mixed-demo'])
    );

  }

}
