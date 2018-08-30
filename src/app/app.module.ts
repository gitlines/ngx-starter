import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {
  CommonPipesModule, ExpandToggleButtonModule,
  EbsFilesModule, EbsCardOrganizerModule, ToolbarModule, AccessDeniedModule,
  LanguageModule, CommonDialogModule, SideContentModule
} from '@elderbyte/ngx-starter';
import {
    MatButtonModule,
    MatCommonModule,
    MatDialogModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule
} from '@angular/material';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SimpleWebStorageModule} from '@elderbyte/ngx-simple-webstorage';
import { DemoPanelComponent } from './demo-panel/demo-panel.component';
import {RouterModule} from '@angular/router';
import {appRoutes} from './app-routes';
import { CardsDemoComponent } from './cards-demo/cards-demo.component';
import {LoggerFactory, LogLevel} from '@elderbyte/ts-logger';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DemoPanelSideComponent} from './demo-panel-side/demo-panel-side.component';

LoggerFactory.getDefaultConfiguration()
  .withMaxLevel(LogLevel.Debug);

@NgModule({
  declarations: [
    AppComponent,
    DemoPanelComponent,
    DemoPanelSideComponent,
    CardsDemoComponent
  ],
  imports: [

    // System
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),

    SimpleWebStorageModule.forRoot(),

    FlexLayoutModule,

    // Material
    MatSidenavModule,
    MatCommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatDialogModule,

    // Library
    CommonPipesModule,
    CommonDialogModule,
    SideContentModule.forRoot(),
    ExpandToggleButtonModule,
    AccessDeniedModule,
    ToolbarModule.forRoot(),
    EbsFilesModule,
    EbsCardOrganizerModule,

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
  bootstrap: [AppComponent],
})
export class AppModule { }

// Because of AOT Compiler
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
