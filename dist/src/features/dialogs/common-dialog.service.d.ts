import { Observable } from 'rxjs/Rx';
import { MdDialog } from '@angular/material';
export declare class CommonDialogService {
    private dialog;
    constructor(dialog: MdDialog);
    confirm(title: string, message: string): Observable<boolean>;
}
