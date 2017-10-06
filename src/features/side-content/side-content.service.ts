
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, NavigationEnd, Router, RouterStateSnapshot} from "@angular/router";
import {NGXLogger} from 'ngx-logger';

/**
 * This service manages the side content.
 * This is usually the left side which is a 'side nav' and the right side which shows detail information.
 */
@Injectable()
export class SideContentService {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    public navigationOpen = false;
    public sideContentOpen = false;


    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/


    constructor(
        private logger: NGXLogger,
        private router: Router,
    ) {

        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(event => event as NavigationEnd)
            .subscribe(event => {

                if (this.isOutletActive('side')) {
                    this.logger.debug('Side-Content: "side" outlet is active -> showing side content!');
                    this.showSideContent();
                }else {
                    this.logger.debug('Side-Content: "side" outlet is NOT active -> HIDING side content!');
                    this.closeSideContent();
                }
                this.closeSideNav();
            });
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/


    public toggleSidenav() {
        this.navigationOpen = !this.navigationOpen;
    }

    public closeSideNav() {
        this.navigationOpen = false;
    }

    public closeSideContent() {
        this.logger.debug('Side-Content: Hiding ...');
        this.sideContentOpen = false;
        this.router.navigate([{outlets: {'side': null}}]);
    }

    /***************************************************************************
     *                                                                         *
     * Private methods                                                         *
     *                                                                         *
     **************************************************************************/

    private isOutletActive(outlet: string): boolean {
        let rs: RouterStateSnapshot =  this.router.routerState.snapshot;
        let snap: ActivatedRouteSnapshot = rs.root;
        return this.isOutletActiveRecursive(snap, outlet);
    }

    private isOutletActiveRecursive(root: ActivatedRouteSnapshot, outlet: string): boolean {
        if (root.outlet === outlet) {
            return true;
        }
        for (let c of root.children) {
            if (this.isOutletActiveRecursive(c, outlet)) {
                return true;
            }
        }
        return false;
    }

    private showSideContent() {
        this.logger.debug('Side-Content: Showing ...');
        this.sideContentOpen = true;
    }

}
