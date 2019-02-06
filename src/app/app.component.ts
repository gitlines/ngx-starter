import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EbsToastService} from '@elderbyte/ngx-starter';
import {EbsSideContentService} from '../../projects/elderbyte/ngx-starter/src/lib/features/side-content/ebs-side-content.service';


@Component({
  selector: 'starter-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public title = 'starter-demo';

  constructor(
    translateService: TranslateService,
    private sideContentService: EbsSideContentService,
    private toastService: EbsToastService
  ) {
    translateService.addLangs(['en', 'de']);
    translateService.defaultLang = 'en';
  }


  public openNav(): void {
    this.sideContentService.navigationOpen = true;
  }

  public get leftSideContentOpen(): boolean {
    return this.sideContentService.navigationOpen;
  }

  public closeLeftSideContent() {
    this.sideContentService.closeSideNav();
  }

  public markAsFavorite(event: Event): void {
    this.toastService.pushInfo('Marked as favorite!');
  }
}
