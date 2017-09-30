import {NgModule} from '@angular/core';
import {
    MatAutocompleteModule,
    MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepicker, MatDatepickerModule, MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatOptionModule, MatProgressBarModule,
    MatProgressSpinnerModule, MatRadioModule, MatSelectModule,
    MatSidenavModule,
    MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatTableModule, MatTabsModule,
    MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';


@NgModule({
    imports: [
        MatListModule, MatGridListModule, MatCardModule, MatTabsModule,
    ],
    exports: [
        MatListModule, MatGridListModule, MatCardModule, MatTabsModule,
    ],
})
export class AngularMaterialLayoutModule { }


@NgModule({
    imports: [
        MatMenuModule, MatSidenavModule, MatToolbarModule
    ],
    exports: [
        MatMenuModule, MatSidenavModule, MatToolbarModule
    ],
})
export class AngularMaterialNavigationModule { }


@NgModule({
    imports: [
        MatDialogModule, MatTooltipModule, MatSnackBarModule
    ],
    exports: [
        MatDialogModule, MatTooltipModule, MatSnackBarModule
    ],
})
export class AngularMaterialPopupsModule { }


@NgModule({
    imports: [
        MatIconModule,

        // User Input / info
        MatInputModule, MatButtonModule, MatRadioModule, MatSlideToggleModule,
        MatOptionModule, MatSliderModule, MatSelectModule, MatCheckboxModule,
        MatAutocompleteModule, MatProgressBarModule, MatProgressSpinnerModule,
        MatChipsModule, MatDatepickerModule
    ],
    exports: [
        MatIconModule,

        // User Input / info
        MatInputModule, MatButtonModule, MatRadioModule, MatSlideToggleModule,
        MatOptionModule, MatSliderModule, MatSelectModule, MatCheckboxModule,
        MatAutocompleteModule, MatProgressBarModule, MatProgressSpinnerModule,
        MatChipsModule, MatDatepickerModule
    ],
})
export class AngularMaterialInputModule { }


@NgModule({
    imports: [
        CdkTableModule, MatTableModule
    ],
    exports: [
        CdkTableModule, MatTableModule
    ],
})
export class AngularMaterialTableModule { }



@NgModule({
    imports: [
        AngularMaterialLayoutModule,
        AngularMaterialNavigationModule,
        AngularMaterialPopupsModule,
        AngularMaterialInputModule,
        AngularMaterialTableModule
    ],
    exports: [
        AngularMaterialLayoutModule,
        AngularMaterialNavigationModule,
        AngularMaterialPopupsModule,
        AngularMaterialInputModule,
        AngularMaterialTableModule
    ],
})
export class AngularMaterialCompleteModule { }
