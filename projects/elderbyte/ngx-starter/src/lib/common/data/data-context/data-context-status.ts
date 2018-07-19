/**
 * Represents the status of a data-context
 */
export class DataContextStatus {

    /***************************************************************************
     *                                                                         *
     * Static builders                                                         *
     *                                                                         *
     **************************************************************************/

    public static error(error: any): DataContextStatus {
        return new DataContextStatus(error);
    }

    public static success(): DataContextStatus {
        return new DataContextStatus(null);
    }

    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/

    constructor(
        private _error: any
    ) {}

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/

    public get error(): any {
        return this._error;
    }

    public get hasError(): boolean {
        return !!this._error;
    }
}
