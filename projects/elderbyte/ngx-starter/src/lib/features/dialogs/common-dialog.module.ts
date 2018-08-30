import { CommonDialogService } from './common-dialog.service';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {MatButtonModule, MatDialogModule, MatIconModule, MatToolbarModule, MatInputModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {QuestionDialogComponent} from './question-dialog/question-dialog.component';
import {CommonDialogConfig} from './common-dialog-config';

export {CommonDialogService} from './common-dialog.service';
export {CommonDialogConfig} from './common-dialog-config';

export * from './confirm-dialog/confirm-dialog.component';
export * from './question-dialog/question-dialog.component';

@NgModule({
    imports: [
        CommonModule, FormsModule,
        FlexLayoutModule,
        MatIconModule, MatButtonModule, MatDialogModule, MatToolbarModule, MatInputModule,
        TranslateModule
    ],
    declarations: [
        ConfirmDialogComponent, QuestionDialogComponent
    ],
    entryComponents: [
        ConfirmDialogComponent, QuestionDialogComponent
    ],
    exports: [
        ConfirmDialogComponent, QuestionDialogComponent
    ]
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
