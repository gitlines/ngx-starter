import { OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
export declare class ExpandToggleButtonComponent implements OnInit {
    private _isExpanded;
    private _expandedChanged;
    name: string;
    ngOnInit(): void;
    readonly expandedChanged: Observable<boolean>;
    isExpanded: boolean;
    onToggleExpand(event: any): void;
}
