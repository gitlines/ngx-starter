


import {ModuleWithProviders, NgModule} from '@angular/core';
import {ToastSnackbarComponent} from './toast-snackbar.component';
import {ToastService} from './toast.service';
import {CommonModule} from '@angular/common';
import {MatSnackBarModule} from '@angular/material';


export * from './toast-snackbar.component';
export * from './toast.service';


@NgModule({
  declarations: [
    ToastSnackbarComponent
  ],
  providers: [
    ToastService
  ],
  exports : [
    ToastSnackbarComponent
  ],
  imports : [ CommonModule, MatSnackBarModule ]
})
export class ToastModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ToastModule,
      providers: [
        {
          provide: ToastService,
          useClass: ToastService
        }
      ]
    };
  }


}
