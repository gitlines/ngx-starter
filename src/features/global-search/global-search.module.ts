
import {ModuleWithProviders, NgModule} from "@angular/core";
import {GlobalSearchComponent} from "./global-search.component";
import {GlobalSearchService} from "./global-search.service";
import {MdButtonModule, MdIconModule, MdInputModule, MdMenuModule} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import {CommonModule} from "@angular/common";

export {GlobalSearchComponent} from "./global-search.component"
export {GlobalSearchService} from "./global-search.service"


@NgModule({
  declarations: [
    GlobalSearchComponent
  ],
  exports : [
    GlobalSearchComponent
  ],
  imports : [ CommonModule, MdIconModule, MdInputModule, MdButtonModule, MdMenuModule, FlexLayoutModule ]
})
export class GlobalSearchModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GlobalSearchModule,
      providers: [
        {
          provide: GlobalSearchService,
          useClass: GlobalSearchService
        },
      ]
    }
  }
}
