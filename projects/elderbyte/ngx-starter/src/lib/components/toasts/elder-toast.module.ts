


import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatSnackBarModule} from '@angular/material';

export * from './elder-toast.service';


@NgModule({
  declarations: [],
  exports : [],
  imports : [ CommonModule, MatSnackBarModule ]
})
export class ElderToastModule {

}
