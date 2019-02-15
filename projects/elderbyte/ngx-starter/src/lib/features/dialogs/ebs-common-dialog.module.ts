import { EbsCommonDialogService } from './ebs-common-dialog.service';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {EbsConfirmDialogComponent} from './confirm-dialog/ebs-confirm-dialog.component';
import {MatButtonModule, MatDialogModule, MatIconModule, MatToolbarModule, MatInputModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {EbsQuestionDialogComponent} from './question-dialog/ebs-question-dialog.component';
import {EbsCommonDialogConfig} from './ebs-common-dialog-config';

export {EbsCommonDialogService} from './ebs-common-dialog.service';
export {EbsCommonDialogConfig} from './ebs-common-dialog-config';

export * from './confirm-dialog/ebs-confirm-dialog.component';
export * from './question-dialog/ebs-question-dialog.component';

@NgModule({
    imports: [
        CommonModule, FormsModule,
        FlexLayoutModule,
        MatIconModule, MatButtonModule, MatDialogModule, MatToolbarModule, MatInputModule,
        TranslateModule
    ],
    declarations: [
        EbsConfirmDialogComponent, EbsQuestionDialogComponent
    ],
    entryComponents: [
        EbsConfirmDialogComponent, EbsQuestionDialogComponent
    ],
    exports: [
        EbsConfirmDialogComponent, EbsQuestionDialogComponent
    ]
})
export class EbsCommonDialogModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: EbsCommonDialogModule,
      providers: [
        {
          provide: EbsCommonDialogService,
          useClass: EbsCommonDialogService
        },
      ]
    };
  }

}
