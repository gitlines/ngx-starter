


import {ModuleWithProviders, NgModule} from '@angular/core';
import {ElderToastComponent} from './elder-toast.component';
import {ElderToastService} from './elder-toast.service';
import {CommonModule} from '@angular/common';
import {MatSnackBarModule} from '@angular/material';


export * from './elder-toast.component';
export * from './elder-toast.service';


@NgModule({
  declarations: [
    ElderToastComponent
  ],
  exports : [
    ElderToastComponent
  ],
  imports : [ CommonModule, MatSnackBarModule ]
})
export class ElderToastModule {

}
