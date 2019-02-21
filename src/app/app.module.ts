import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import {
  EbsShellModule, EbsNavModule,
  EbsPipesModule, EbsExpandToggleButtonModule,
  EbsFilesModule,
  EbsCardOrganizerModule,
  EbsTableModule,
  EbsToolbarModule,
  EbsAccessDeniedModule,
  EbsLanguageModule,
  EbsCommonDialogModule,
  EbsSideContentModule,
  EbsLabelsModule,
  EbsMatPanelModule,
  EbsToastModule,
  EbsDatesModule,
  EbsLocalesDeChModule,
  EbsSelectListModule,
  EbsFormSupportDirectivesModule
} from '@elderbyte/ngx-starter';
import {
  MatButtonModule, MatChipsModule,
  MatCommonModule,
  MatDialogModule, MatDividerModule,
  MatIconModule, MatListModule, MatMenuModule,
  MatSidenavModule, MatSortModule, MatTableModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DemoPanelComponent } from './demo-panel/demo-panel.component';
import {RouterModule} from '@angular/router';
import {appRoutes} from './app-routes';
import { CardsDemoComponent } from './cards-demo/cards-demo.component';
import {LoggerFactory, LogLevel} from '@elderbyte/ts-logger';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DemoPanelSideComponent} from './demo-panel-side/demo-panel-side.component';
import { TableDemoComponent } from './table-demo/table-demo.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EatableCategoryListComponent } from './eatables/categories/category-list/eatable-category-list.component';
import { EatableCategoryDetailComponent } from './eatables/categories/category-detail/eatable-category-detail.component';
import { TableMasterDetailComponent } from './table-master-detail/table-master-detail.component';
import { DemoSimpleSideComponent } from './demo-simple-side/demo-simple-side.component';
import { SelectListDemoComponent } from './components/select-list-demo/select-list-demo.component';
import { CardOrganizerDemoComponent } from './cards-demo/card-organizer-demo/card-organizer-demo.component';
import { CardStackSorterComponent } from './cards-demo/card-stack-sorter/card-stack-sorter.component';


LoggerFactory.getDefaultConfiguration()
  .withMaxLevel(LogLevel.Trace);

@NgModule({
  declarations: [
    AppComponent,
    DemoPanelComponent,
    DemoPanelSideComponent,
    TableDemoComponent,
    EatableCategoryListComponent,
    EatableCategoryDetailComponent,
    TableMasterDetailComponent,
    DemoSimpleSideComponent,
    SelectListDemoComponent,

    CardsDemoComponent,
    CardOrganizerDemoComponent,
    CardStackSorterComponent
  ],
  imports: [

    // System
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    RouterModule,

    FormsModule,
    ReactiveFormsModule,

    FlexLayoutModule,

    // Material
    MatSidenavModule, MatMenuModule,
    MatCommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,

    MatTableModule,
    MatSortModule,

    // Library
    EbsShellModule,
    EbsNavModule,

    EbsPipesModule,
    EbsCommonDialogModule,
    EbsToastModule,
    EbsSideContentModule,
    EbsExpandToggleButtonModule,
    EbsAccessDeniedModule,
    EbsFilesModule,
    EbsCardOrganizerModule,
    EbsTableModule,
    EbsMatPanelModule,
    EbsLabelsModule,
    EbsToolbarModule,
    EbsFormSupportDirectivesModule,

    EbsLocalesDeChModule.forRoot(),
    EbsDatesModule,
    EbsSelectListModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),

    EbsLanguageModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

// Because of AOT Compiler
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
