import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgxStarterModule, CommonPipesModule, ExpandToggleButtonModule} from '@elderbyte/ngx-starter';
import {MatButtonModule, MatCommonModule, MatTabsModule, MatToolbarModule} from '@angular/material';
import {LanguageModule} from '../../projects/elderbyte/ngx-starter/src/lib/features/language/language.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AccessDeniedModule} from '../../projects/elderbyte/ngx-starter/src/lib/components/access-denied/access-denied.module';
import {SimpleWebStorageModule} from '@elderbyte/ngx-simple-webstorage';
import { DemoPanelComponent } from './demo-panel/demo-panel.component';
import {RouterModule} from '@angular/router';
import {appRoutes} from './app-routes';
import { CardsDemoComponent } from './cards-demo/cards-demo.component';
import {ToolbarModule} from '../../projects/elderbyte/ngx-starter/src/lib/features/toolbar/toolbar.module';
import {LoggerFactory, LogLevel} from '@elderbyte/ts-logger';
import {FileUploadModule} from '../../projects/elderbyte/ngx-starter/src/lib/components/file-upload/file-upload.module';

LoggerFactory.getDefaultConfiguration()
  .withMaxLevel(LogLevel.Debug);

@NgModule({
  declarations: [
    AppComponent,
    DemoPanelComponent,
    CardsDemoComponent
  ],
  imports: [

    // System
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),

    SimpleWebStorageModule.forRoot(),

    // Material
    MatCommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,

    // Library
    NgxStarterModule,
    CommonPipesModule,
    ExpandToggleButtonModule,
    AccessDeniedModule,
    ToolbarModule.forRoot(),
    FileUploadModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),

    LanguageModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// Because of AOT Compiler
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
