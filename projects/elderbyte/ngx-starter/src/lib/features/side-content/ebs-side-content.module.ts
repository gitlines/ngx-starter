


import {ModuleWithProviders, NgModule} from '@angular/core';
import {EbsSideContentToggleComponent} from './side-content-toggle/ebs-side-content-toggle.component';
import {EbsSideContentService} from './ebs-side-content.service';
import {CommonModule} from '@angular/common';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';

export * from './ebs-side-content.service';
export * from './side-content-toggle/ebs-side-content-toggle.component';


@NgModule({
  declarations: [
    EbsSideContentToggleComponent
  ],
  exports : [
    EbsSideContentToggleComponent
  ],
  imports : [ CommonModule, RouterModule, MatIconModule, MatButtonModule, FlexLayoutModule ]
})
export class EbsSideContentModule {}
