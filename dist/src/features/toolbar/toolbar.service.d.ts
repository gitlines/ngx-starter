import { Observable } from "rxjs/Observable";
export declare class ToolbarHeader {
    name: string;
    constructor(name: string);
}
export declare class ToolbarService {
    private _titleChange;
    private _title;
    constructor();
    title: ToolbarHeader;
    readonly titleChange: Observable<ToolbarHeader>;
}
