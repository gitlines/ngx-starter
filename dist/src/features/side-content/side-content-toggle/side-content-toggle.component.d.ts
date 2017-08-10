import { OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SideContentService } from "../side-content.service";
export declare class SideContentToggleComponent implements OnInit, OnDestroy {
    private router;
    private sideContentService;
    private sub;
    isMainRoute: boolean;
    constructor(router: Router, sideContentService: SideContentService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    toggleSideContent(): void;
    goBack(): void;
}
