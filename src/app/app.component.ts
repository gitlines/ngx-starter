import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SideContentService, ToastService} from '@elderbyte/ngx-starter';

export class MenuItem {

    constructor(
        public icon: string,
        public name: string,
        public link: string) {
    }
}


@Component({
  selector: 'starter-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public title = 'starter-demo';

    public menuItems: MenuItem[];


    constructor(
    translateService: TranslateService,
    private sideContentService: SideContentService,
    private toastService: ToastService
  ) {
    translateService.addLangs(['en', 'de']);
    translateService.defaultLang = 'en';

        this.menuItems = [

            new MenuItem('list', 'Eatables', 'app/eatables'),
            new MenuItem('person', 'Mixed', 'app/mixed-demo'),
            new MenuItem('business', 'TB Title', 'app/sub/toolbar-title-demo'),
            new MenuItem('business', 'Override Title', 'app/sub/override-title'),
        ];
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

    public markAsFavorite(event: Event): void {
      this.toastService.pushInfo('Marked as favorite!');
    }
}
