import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgxStarterModule} from '@elderbyte/ngx-starter';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxStarterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
