import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'starter-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  public searchOpen = false;
  public title = 'starter-demo';

  constructor(
    translateService: TranslateService
  ) {
    translateService.addLangs(['en', 'de']);
    translateService.defaultLang = 'en';
  }
}
