
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, NavigationExtras, Router, RouterStateSnapshot} from '@angular/router';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {filter, map} from 'rxjs/operators';

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
    private _sideContentOpen = false;
    private _detailContentOutlet = 'side';
    private _clickOutsideToClose = true;

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        private router: Router,
    ) {

        this.router.events.pipe(
                filter(event => event instanceof NavigationEnd),
                map(event => event as NavigationEnd)
            )
            .subscribe(event => {

                if (this.isOutletActive(this.detailContentOutlet)) {
                    this.logger.trace(`"${this.detailContentOutlet}" outlet is active -> showing side content!`);
                    this.showSideContentInternal();
                } else {
                    this.logger.trace(`"${this.detailContentOutlet}" outlet is NOT active -> HIDING side content!`);
                    this.closeSideContentInternal();
                }
                this.closeSideNav();
            });
    }

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/

    /**
     * Checks if the side content is currently isOpen
     */
    public get sideContentOpen(): boolean {
        return this._sideContentOpen;
    }

    public set sideContentOpen(value: boolean) {
        this._sideContentOpen = value;
    }

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
     * Gets the name of the detail outlet.
     * Default is 'side'
     */
    public get detailContentOutlet(): string {
        return this._detailContentOutlet;
    }

    /**
     * Sets the name of the detail outlet.
     */
    public set detailContentOutlet(value: string) {
        this._detailContentOutlet = value;
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

        const command: any = {};
        command['outlets'] = {};
        command['outlets'][this.detailContentOutlet] = null;

        return this.router.navigate([
            command
            ]);
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

    /***************************************************************************
     *                                                                         *
     * Private methods                                                         *
     *                                                                         *
     **************************************************************************/

    private closeSideContentInternal(): void {
        this.logger.trace('Hiding Side Content');
        this.sideContentOpen = false;
    }

    private showSideContentInternal() {
        this.logger.trace('Showing Side Content');
        this.sideContentOpen = true;
    }

    private isOutletActive(outlet: string): boolean {
        const rs: RouterStateSnapshot =  this.router.routerState.snapshot;
        const snap: ActivatedRouteSnapshot = rs.root;
        return this.isOutletActiveRecursive(snap, outlet);
    }

    private isOutletActiveRecursive(root: ActivatedRouteSnapshot, outlet: string): boolean {
        if (root.outlet === outlet) {
            return true;
        }
        for (const c of root.children) {
            if (this.isOutletActiveRecursive(c, outlet)) {
                return true;
            }
        }
        return false;
    }



}
