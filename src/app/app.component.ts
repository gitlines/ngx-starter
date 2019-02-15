import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EbsToastService} from '@elderbyte/ngx-starter';


@Component({
  selector: 'starter-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public title = 'starter-demo';

  constructor(
    translateService: TranslateService,
    private toastService: EbsToastService
  ) {
    translateService.addLangs(['en', 'de']);
    translateService.defaultLang = 'en';
  }

}
