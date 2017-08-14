import { CommonDialogService } from './common-dialog.service';
import {ModuleWithProviders, NgModule} from '@angular/core';

import { ConfirmDialog }   from './confirm-dialog/confirm-dialog.component';
import {MdButtonModule, MdDialogModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';


export {CommonDialogService} from './common-dialog.service'
export {ConfirmDialog} from './confirm-dialog/confirm-dialog.component'


@NgModule({
    imports: [
        TranslateModule,
        MdDialogModule,
        MdButtonModule
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
