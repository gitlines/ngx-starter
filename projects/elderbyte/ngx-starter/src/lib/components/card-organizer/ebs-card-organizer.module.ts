import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EbsCardOrganizerComponent, EbsStackCardDirective } from './card-organizer/ebs-card-organizer.component';
import { EbsCardStackComponent } from './card-stack/ebs-card-stack.component';
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
export * from './card-organizer/ebs-card-organizer.component';
export * from './card-stack/ebs-card-stack.component';


@NgModule({
  imports: [
    CommonModule,

    MatIconModule, MatButtonModule, MatCardModule, MatDividerModule,
    MatRippleModule,

    DragDropModule,

    FlexLayoutModule, TranslateModule
  ],
  declarations: [EbsCardOrganizerComponent, EbsCardStackComponent, EbsStackCardDirective],
  exports: [EbsCardOrganizerComponent, EbsCardStackComponent, EbsStackCardDirective],
})
export class EbsCardOrganizerModule { }
