import { ErrorHandler } from "@angular/core";
var GeneralErrorHandler = (function () {
    function GeneralErrorHandler() {
        this.errorHandler = new ErrorHandler();
    }
    GeneralErrorHandler.prototype.handleError = function (error) {
        // only if error is not set to error handled by ui do something
        // else in the ui the error will be shown and doesn't need to be
        // handled.
        if (error.rejection !== "error handled by ui") {
            this.errorHandler.handleError(error);
        }
    };
    return GeneralErrorHandler;
}());
export { GeneralErrorHandler };
//# sourceMappingURL=general-error-handler.js.map