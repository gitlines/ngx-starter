import {ErrorHandler} from '@angular/core';

export class GeneralErrorHandler implements ErrorHandler {

  private errorHandler = new ErrorHandler();

  handleError(error: any) {
    // only if error is not set to error handled by ui do something
    // else in the ui the error will be shown and doesn't need to be
    // handled.
    if (error.rejection !== 'error handled by ui') {
      this.errorHandler.handleError(error);
    }
  }

}
