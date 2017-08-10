import { NgModule } from "@angular/core";
import { MdAutocompleteModule, MdButtonModule, MdCardModule, MdCheckboxModule, MdChipsModule, MdDatepickerModule, MdDialogModule, MdGridListModule, MdIconModule, MdInputModule, MdListModule, MdMenuModule, MdOptionModule, MdProgressBarModule, MdProgressSpinnerModule, MdRadioModule, MdSelectModule, MdSidenavModule, MdSliderModule, MdSlideToggleModule, MdSnackBarModule, MdTableModule, MdTabsModule, MdToolbarModule, MdTooltipModule } from "@angular/material";
import { CdkTableModule } from "@angular/cdk";
var AngularMaterialLayoutModule = (function () {
    function AngularMaterialLayoutModule() {
    }
    AngularMaterialLayoutModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        MdListModule, MdGridListModule, MdCardModule, MdTabsModule,
                    ],
                    exports: [
                        MdListModule, MdGridListModule, MdCardModule, MdTabsModule,
                    ],
                },] },
    ];
    /** @nocollapse */
    AngularMaterialLayoutModule.ctorParameters = function () { return []; };
    return AngularMaterialLayoutModule;
}());
export { AngularMaterialLayoutModule };
var AngularMaterialNavigationModule = (function () {
    function AngularMaterialNavigationModule() {
    }
    AngularMaterialNavigationModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        MdMenuModule, MdSidenavModule, MdToolbarModule
                    ],
                    exports: [
                        MdMenuModule, MdSidenavModule, MdToolbarModule
                    ],
                },] },
    ];
    /** @nocollapse */
    AngularMaterialNavigationModule.ctorParameters = function () { return []; };
    return AngularMaterialNavigationModule;
}());
export { AngularMaterialNavigationModule };
var AngularMaterialPopupsModule = (function () {
    function AngularMaterialPopupsModule() {
    }
    AngularMaterialPopupsModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        MdDialogModule, MdTooltipModule, MdSnackBarModule
                    ],
                    exports: [
                        MdDialogModule, MdTooltipModule, MdSnackBarModule
                    ],
                },] },
    ];
    /** @nocollapse */
    AngularMaterialPopupsModule.ctorParameters = function () { return []; };
    return AngularMaterialPopupsModule;
}());
export { AngularMaterialPopupsModule };
var AngularMaterialInputModule = (function () {
    function AngularMaterialInputModule() {
    }
    AngularMaterialInputModule.decorators = [
        { type: NgModule, args: [{
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
                },] },
    ];
    /** @nocollapse */
    AngularMaterialInputModule.ctorParameters = function () { return []; };
    return AngularMaterialInputModule;
}());
export { AngularMaterialInputModule };
var AngularMaterialTableModule = (function () {
    function AngularMaterialTableModule() {
    }
    AngularMaterialTableModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CdkTableModule, MdTableModule
                    ],
                    exports: [
                        CdkTableModule, MdTableModule
                    ],
                },] },
    ];
    /** @nocollapse */
    AngularMaterialTableModule.ctorParameters = function () { return []; };
    return AngularMaterialTableModule;
}());
export { AngularMaterialTableModule };
var AngularMaterialCompleteModule = (function () {
    function AngularMaterialCompleteModule() {
    }
    AngularMaterialCompleteModule.decorators = [
        { type: NgModule, args: [{
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
                },] },
    ];
    /** @nocollapse */
    AngularMaterialCompleteModule.ctorParameters = function () { return []; };
    return AngularMaterialCompleteModule;
}());
export { AngularMaterialCompleteModule };
//# sourceMappingURL=material.module.js.map