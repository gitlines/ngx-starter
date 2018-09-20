


import {ModuleWithProviders, NgModule} from '@angular/core';
import {SideContentToggleComponent} from './side-content-toggle/side-content-toggle.component';
import {SideContentService} from './side-content.service';
import {CommonModule} from '@angular/common';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';

export * from './side-content.service';
export * from './side-content-toggle/side-content-toggle.component';


@NgModule({
  declarations: [
    SideContentToggleComponent
  ],
  exports : [
    SideContentToggleComponent
  ],
  imports : [ CommonModule, RouterModule, MatIconModule, MatButtonModule, FlexLayoutModule ]
})
export class SideContentModule {}
