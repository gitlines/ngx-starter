


import {ModuleWithProviders, NgModule} from '@angular/core';
import {EbsToastComponent} from './ebs-toast.component';
import {EbsToastService} from './ebs-toast.service';
import {CommonModule} from '@angular/common';
import {MatSnackBarModule} from '@angular/material';


export * from './ebs-toast.component';
export * from './ebs-toast.service';


@NgModule({
  declarations: [
    EbsToastComponent
  ],
  exports : [
    EbsToastComponent
  ],
  imports : [ CommonModule, MatSnackBarModule ]
})
export class EbsToastModule {

}
