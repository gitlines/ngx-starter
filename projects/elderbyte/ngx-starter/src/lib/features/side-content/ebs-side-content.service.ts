
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, NavigationExtras, Router, RouterStateSnapshot} from '@angular/router';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {filter, map} from 'rxjs/operators';
import {RouterOutletService} from '../../components/shell/drawers/router-outlet.service';

/**
 * This service manages the side content.
 * This is usually the left side which is a 'side nav' and the right side which shows detail information.
 */
@Injectable({
    providedIn: 'root'
})
export class EbsSideContentService {


    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger = LoggerFactory.getLogger('EbsSideContentService');

    private _navigationOpen = false;
    private _clickOutsideToClose = true;

    private detailContentOutlet = 'side';

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        private router: Router,
        private routerOutletService: RouterOutletService,
    ) {

        this.router.events.pipe(
                filter(event => event instanceof NavigationEnd),
                map(event => event as NavigationEnd)
            )
            .subscribe(event => {
                this.closeSideNav();
            });
    }

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/

    /**
     * Checks if the navigation is isOpen
     */
    public get navigationOpen(): boolean {
        return this._navigationOpen;
    }

    public set navigationOpen(value: boolean) {
        this._navigationOpen = value;
    }

    /**
     * Allow closing the side content by clicking outside of it.
     */
    public get clickOutsideToClose(): boolean {
        return this._clickOutsideToClose;
    }


    public set clickOutsideToClose(value: boolean) {
        this._clickOutsideToClose = value;
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    /**
     * Toggles the side navigation
     */
    public toggleSidenav(): boolean {
        this.navigationOpen = !this.navigationOpen;
        return this.navigationOpen;
    }

    /**
     * Closes the side navigation
     */
    public closeSideNav(): void {
        this.navigationOpen = false;
    }

    /**
     * Closes the side detail content
     */
    public closeSideContent(): Promise<boolean> {
      return this.routerOutletService.deactivate(this.detailContentOutlet);
    }

    /**
     * Shows the side content
     * @param args The route arguments / path
     * @param clickOutsideToClose If enabled, the side content can be closed by clicking outside of it.
     * @param extras
     */
    public navigateSideContent(args: string[], clickOutsideToClose: boolean, extras?: NavigationExtras): Promise<boolean> {

        this.clickOutsideToClose = clickOutsideToClose;

        const command: any = {};
        command['outlets'] = {};
        command['outlets'][this.detailContentOutlet] = args;

        return this.router.navigate(
            [command],
            extras
        );
    }

}
