import { ElderDialogService } from './elder-dialog.service';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {ElderConfirmDialogComponent} from './confirm-dialog/elder-confirm-dialog.component';
import {MatButtonModule, MatDialogModule, MatIconModule, MatToolbarModule, MatInputModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {ElderQuestionDialogComponent} from './question-dialog/elder-question-dialog.component';
import {ElderDialogConfig} from './elder-dialog-config';

export {ElderDialogService} from './elder-dialog.service';
export {ElderDialogConfig} from './elder-dialog-config';

export * from './confirm-dialog/elder-confirm-dialog.component';
export * from './question-dialog/elder-question-dialog.component';

@NgModule({
    imports: [
        CommonModule, FormsModule,
        FlexLayoutModule,
        MatIconModule, MatButtonModule, MatDialogModule, MatToolbarModule, MatInputModule,
        TranslateModule
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

}
