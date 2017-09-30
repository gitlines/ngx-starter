import { CommonDialogService } from './common-dialog.service';
import {ModuleWithProviders, NgModule} from '@angular/core';

import { ConfirmDialog }   from './confirm-dialog/confirm-dialog.component';
import {MatButtonModule, MatDialogModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';


export {CommonDialogService} from './common-dialog.service'
export {ConfirmDialog} from './confirm-dialog/confirm-dialog.component'


@NgModule({
    imports: [
        TranslateModule,
        MatDialogModule,
        MatButtonModule
    ],
    exports: [
        ConfirmDialog,
    ],
    declarations: [
        ConfirmDialog,
    ],
    entryComponents: [
        ConfirmDialog
    ],
})
export class CommonDialogModule {


  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CommonDialogModule,
      providers: [
        {
          provide: CommonDialogService,
          useClass: CommonDialogService
        },
      ]
    };
  }

}
