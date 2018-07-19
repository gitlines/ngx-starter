import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgxStarterModule, CommonPipesModule} from '@elderbyte/ngx-starter';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxStarterModule,
    CommonPipesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
