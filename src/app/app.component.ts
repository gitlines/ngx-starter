import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ElderToastService} from '@elderbyte/ngx-starter';
import {LoggerFactory} from '@elderbyte/ts-logger';


@Component({
  selector: 'starter-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private readonly logger = LoggerFactory.getLogger('AppComponent');

  public title = 'starter-demo';

  constructor(
    translateService: TranslateService,
    private toastService: ElderToastService
  ) {
    translateService.addLangs(['en', 'de']);
    translateService.defaultLang = 'en';
  }

  public logClick(): void {
    this.logger.info('Nav Button was clicked!');
  }

}
