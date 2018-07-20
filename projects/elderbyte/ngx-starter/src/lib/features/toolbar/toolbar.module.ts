
import {ModuleWithProviders, NgModule} from '@angular/core';
import {ToolbarTitleComponent} from './toolbar-title.component';
import {ToolbarService} from './toolbar.service';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

export * from './toolbar-title.component';
export * from './toolbar.service';


@NgModule({
  imports: [
    CommonModule, TranslateModule
  ],
  declarations: [
    ToolbarTitleComponent
  ],
  exports : [
    ToolbarTitleComponent
  ]
})
export class ToolbarModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ToolbarModule,
      providers: [ ]
    };
  }
}
