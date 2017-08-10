import { OnDestroy, OnInit } from "@angular/core";
import { ToolbarService } from "./toolbar.service";
export declare class ToolbarTitleComponent implements OnInit, OnDestroy {
    private toolbarService;
    title: string;
    private _sub;
    constructor(toolbarService: ToolbarService);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
