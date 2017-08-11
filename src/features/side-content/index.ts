


import {ModuleWithProviders, NgModule} from "@angular/core";
import {SideContentToggleComponent} from "./side-content-toggle/side-content-toggle.component";
import {SideContentService} from "./side-content.service";
import {CommonModule} from "@angular/common";
import {MdButtonModule, MdIconModule} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";

export * from "./side-content.service"
export * from "./side-content-toggle/side-content-toggle.component"


@NgModule({
  declarations: [
    SideContentToggleComponent
  ],
  exports : [
    SideContentToggleComponent
  ],
  imports : [ CommonModule, MdIconModule, MdButtonModule, FlexLayoutModule ]
})
export class SideContentModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SideContentModule,
      providers: [
        {
          provide: SideContentService,
          useClass: SideContentService
        },
      ]
    }
  }
}
