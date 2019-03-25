
import {MatDialogConfig} from '@angular/material';

export class ElderDialogConfig {

    /**
     * String displayed as title of dialog.
     */
    public title: string;

    /**
     * Configuration object of Angular Material Dialog.
     */
    public config?: MatDialogConfig;

    /**
     * Parameter object holding key value pairs to use for interpolation
     * during translation.
     */
    public interpolateParams?: Object;
}
