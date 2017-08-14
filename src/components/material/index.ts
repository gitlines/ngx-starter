import {NgModule} from '@angular/core';
import {
    MdAutocompleteModule,
    MdButtonModule, MdCardModule, MdCheckboxModule, MdChipsModule, MdDatepicker, MdDatepickerModule, MdDialogModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdOptionModule, MdProgressBarModule,
    MdProgressSpinnerModule, MdRadioModule, MdSelectModule,
    MdSidenavModule,
    MdSliderModule, MdSlideToggleModule, MdSnackBarModule, MdTableModule, MdTabsModule,
    MdToolbarModule, MdTooltipModule
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk';


@NgModule({
    imports: [
        MdListModule, MdGridListModule, MdCardModule, MdTabsModule,
    ],
    exports: [
        MdListModule, MdGridListModule, MdCardModule, MdTabsModule,
    ],
})
export class AngularMaterialLayoutModule { }


@NgModule({
    imports: [
        MdMenuModule, MdSidenavModule, MdToolbarModule
    ],
    exports: [
        MdMenuModule, MdSidenavModule, MdToolbarModule
    ],
})
export class AngularMaterialNavigationModule { }


@NgModule({
    imports: [
        MdDialogModule, MdTooltipModule, MdSnackBarModule
    ],
    exports: [
        MdDialogModule, MdTooltipModule, MdSnackBarModule
    ],
})
export class AngularMaterialPopupsModule { }


@NgModule({
    imports: [
        MdIconModule,

        // User Input / info
        MdInputModule, MdButtonModule, MdRadioModule, MdSlideToggleModule,
        MdOptionModule, MdSliderModule, MdSelectModule, MdCheckboxModule,
        MdAutocompleteModule, MdProgressBarModule, MdProgressSpinnerModule,
        MdChipsModule, MdDatepickerModule
    ],
    exports: [
        MdIconModule,

        // User Input / info
        MdInputModule, MdButtonModule, MdRadioModule, MdSlideToggleModule,
        MdOptionModule, MdSliderModule, MdSelectModule, MdCheckboxModule,
        MdAutocompleteModule, MdProgressBarModule, MdProgressSpinnerModule,
        MdChipsModule, MdDatepickerModule
    ],
})
export class AngularMaterialInputModule { }


@NgModule({
    imports: [
        CdkTableModule, MdTableModule
    ],
    exports: [
        CdkTableModule, MdTableModule
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
