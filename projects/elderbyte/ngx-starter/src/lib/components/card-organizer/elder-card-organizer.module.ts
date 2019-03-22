import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElderCardOrganizerComponent, ElderStackCardDirective } from './card-organizer/elder-card-organizer.component';
import { ElderCardStackComponent } from './card-stack/elder-card-stack.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatRippleModule
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';

export * from './card-organizer-data';
export * from './card-stack';
export * from './card-organizer/elder-card-organizer.component';
export * from './card-stack/elder-card-stack.component';


@NgModule({
  imports: [
    CommonModule,

    MatIconModule, MatButtonModule, MatCardModule, MatDividerModule,
    MatRippleModule,

    DragDropModule,

    FlexLayoutModule, TranslateModule
  ],
  declarations: [ElderCardOrganizerComponent, ElderCardStackComponent, ElderStackCardDirective],
  exports: [ElderCardOrganizerComponent, ElderCardStackComponent, ElderStackCardDirective],
})
export class ElderCardOrganizerModule { }
