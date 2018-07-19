import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgxStarterModule, CommonPipesModule, ExpandToggleButtonModule} from '@elderbyte/ngx-starter';
import {MatButtonModule, MatCommonModule, MatToolbarModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [

    MatCommonModule,
    MatToolbarModule,
    MatButtonModule,

    BrowserModule,
    NgxStarterModule,
    CommonPipesModule,
    ExpandToggleButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
