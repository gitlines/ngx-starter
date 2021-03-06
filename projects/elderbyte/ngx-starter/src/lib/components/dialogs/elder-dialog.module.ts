import { ElderDialogService } from './elder-dialog.service';
import {Injectable, ModuleWithProviders, NgModule} from '@angular/core';

import {ElderConfirmDialogComponent} from './confirm-dialog/elder-confirm-dialog.component';
import {MatButtonModule, MatDialogModule, MatIconModule, MatToolbarModule, MatInputModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {ElderQuestionDialogComponent} from './question-dialog/elder-question-dialog.component';
import {ElderDialogConfig} from './elder-dialog-config';
import {A11yModule} from '@angular/cdk/a11y';

export {ElderDialogService} from './elder-dialog.service';
export {ElderDialogConfig} from './elder-dialog-config';

export * from './confirm-dialog/elder-confirm-dialog.component';
export * from './question-dialog/elder-question-dialog.component';

/**
 * @deprecated Please switch to ElderDialogService
 */
@Injectable()
export class EbsCommonDialogService extends ElderDialogService { }

@NgModule({
  imports: [
    CommonModule, FormsModule,

    MatIconModule, MatButtonModule, MatDialogModule, MatToolbarModule, MatInputModule,
    A11yModule,

    FlexLayoutModule, TranslateModule
  ],
  declarations: [
    ElderConfirmDialogComponent, ElderQuestionDialogComponent
  ],
  entryComponents: [
    ElderConfirmDialogComponent, ElderQuestionDialogComponent
  ],
  exports: [
    ElderConfirmDialogComponent, ElderQuestionDialogComponent
  ]
})
export class ElderDialogModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ElderDialogModule,
      providers: [
        ElderDialogService,
        EbsCommonDialogService
      ]
    };
  }
}
