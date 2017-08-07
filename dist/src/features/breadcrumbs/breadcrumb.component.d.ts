import { OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { BreadcrumbService, IBreadcrumb } from "./breadcrumb.service";
export declare class BreadcrumbComponent implements OnInit {
    private breadcrumbService;
    private router;
    private route;
    private ROUTE_DATA_BREADCRUMB;
    breadcrumbs: IBreadcrumb[];
    /**
     * @class DetailComponent
     * @constructor
     */
    constructor(breadcrumbService: BreadcrumbService, router: Router, route: ActivatedRoute);
    /**
     * Let's go!
     *
     * @class DetailComponent
     * @method ngOnInit
     */
    ngOnInit(): void;
    private updateBreadcrumbs(url);
    private getBreadcrumbs(url);
}
