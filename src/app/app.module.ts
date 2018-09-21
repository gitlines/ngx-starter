import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {
  CommonPipesModule, ExpandToggleButtonModule,
  EbsFilesModule,
  EbsCardOrganizerModule,
  EbsTableModule,
  ToolbarModule,
  AccessDeniedModule,
  LanguageModule,
  CommonDialogModule,
  SideContentModule,
  EbsLabelsModule,
  MatPanelModule,
  EbsToolbarModule
} from '@elderbyte/ngx-starter';
import {
  MatButtonModule,
  MatCommonModule,
  MatDialogModule,
  MatIconModule,
  MatSidenavModule, MatSortModule, MatTableModule,
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
import { TableDemoComponent } from './table-demo/table-demo.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastModule} from '../../projects/elderbyte/ngx-starter/src/lib/features/toasts/toast.module';

LoggerFactory.getDefaultConfiguration()
  .withMaxLevel(LogLevel.Debug);

@NgModule({
  declarations: [
    AppComponent,
    DemoPanelComponent,
    DemoPanelSideComponent,
    CardsDemoComponent,
    TableDemoComponent
  ],
  imports: [

    // System
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),

    FormsModule,
    ReactiveFormsModule,

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

    MatTableModule,
    MatSortModule,

    // Library
    CommonPipesModule,
    CommonDialogModule,
    ToastModule.forRoot(),
    SideContentModule,
    ExpandToggleButtonModule,
    AccessDeniedModule,
    ToolbarModule.forRoot(),
    EbsFilesModule,
    EbsCardOrganizerModule,
    EbsTableModule,
    MatPanelModule,
    EbsLabelsModule,
    EbsToolbarModule,

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
