

import {CommonModule} from "@angular/common";
import {ErrorHandler, ModuleWithProviders, NgModule} from "@angular/core";
import {GeneralErrorHandler} from "./general-error-handler";

@NgModule({
    imports : [CommonModule],
})
export class ErrorHandlerModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ErrorHandlerModule,
            providers: [
                {
                    provide: ErrorHandler,
                    useClass: GeneralErrorHandler
                },
            ]
        }
    }
}
