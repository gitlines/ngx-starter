import { Component, OnInit} from '@angular/core';
import { ElderShellService } from '@elderbyte/ngx-starter';
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
      private shellService: ElderShellService
  ) { }

  ngOnInit() {
  }

  public close(event: Event): void {
    this.shellService.closeSideContent();
  }

  public navigate(): void {
    this.shellService.closeSideContent().then(
      () => this.router.navigate(['/app/mixed-demo'])
    );

  }

}
