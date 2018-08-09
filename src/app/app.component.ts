import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SideContentService} from '../../projects/elderbyte/ngx-starter/src/lib/features/side-content/side-content.service';

@Component({
  selector: 'starter-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  public searchOpen = false;
  public title = 'starter-demo';

  constructor(
    translateService: TranslateService,
    private sideContentService: SideContentService
  ) {
    translateService.addLangs(['en', 'de']);
    translateService.defaultLang = 'en';
  }


    public get navigationOpen(): boolean {
        return this.sideContentService.navigationOpen;
    }

    public get sideContentOpen(): boolean {
        return this.sideContentService.sideContentOpen;
    }

    public get disableClose(): boolean {
        return false;
        // return this.sideContentService.clickOutsideToClose;
    }

    public closeSideNav() {
        this.sideContentService.closeSideNav();
    }

    public closeSideContent() {
        this.sideContentService.closeSideContent();
    }
}
