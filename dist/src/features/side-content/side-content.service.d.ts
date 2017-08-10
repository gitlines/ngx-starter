import { ActivatedRouteSnapshot, Router } from "@angular/router";
/**
 * This service manages the side content.
 * This is usually the left side which is a 'side nav' and the right side which shows detail information.
 */
export declare class SideContentService {
    private router;
    navigationOpen: boolean;
    sideContentOpen: boolean;
    constructor(router: Router);
    toggleSidenav(): void;
    closeSideNav(): void;
    closeSideContent(): void;
    isOutletActive(outlet: string): boolean;
    isOutletActiveRecursive(root: ActivatedRouteSnapshot, outlet: string): boolean;
    private showSideContent();
}
