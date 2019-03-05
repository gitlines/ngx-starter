import { Injectable } from '@angular/core';
import {MatDrawer} from '@angular/material';
import {RouterOutletService} from './router-outlet.service';
import {Subscription} from 'rxjs';
import {LoggerFactory} from '@elderbyte/ts-logger';

@Injectable({
  providedIn: 'root'
})
export class RouteOutletDrawerService {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('RouteOutletDrawerService');

  private outletChangeSubscription: Subscription;
  private readonly outletDrawers = new Map<string, MatDrawer>();

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private outletService: RouterOutletService
  ) { }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Bind a named outlet to a mat-drawer.
   * When the route outlet is active (i.e. present in the url), the drawer will be shown.
   * @param routeOutlet
   * @param drawer
   */
  public registerOutletDrawer(routeOutlet: string, drawer: MatDrawer): void {

    if (!routeOutlet) { throw new Error('routeOutlet must not be null!'); }
    if (!drawer) { throw new Error('drawer must not be null!'); }


    const sub = drawer.closedStart.subscribe(
      () => { this.outletService.deactivate(routeOutlet); }
    );

    // TODO Support un-subscribing / unregistering a outlet-drawer

    this.outletDrawers.set(routeOutlet, drawer);

    this.ensureOutletsAreObserved();
  }

  public findDrawer(routeOutlet: string): MatDrawer {
    return this.outletDrawers.get(routeOutlet);
  }

  public openOutletDrawer(routeOutlet: string): void {
    const drawer = this.findDrawer(routeOutlet);
    if (drawer) {
      this.openDrawer(drawer);
    }
  }

  public closeOutletDrawer(routeOutlet: string): void {
    const drawer = this.findDrawer(routeOutlet);
    if (drawer) {
      this.closeDrawer(drawer);
    }
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private openDrawer(drawer: MatDrawer): Promise<any> {
    return drawer.open('program');
  }

  private closeDrawer(drawer: MatDrawer): Promise<any> {
    return drawer.close();
  }

  private updateDrawers(activeOutlets: Set<string>): void {
    this.outletDrawers.forEach((drawer, outlet) => {
      if (activeOutlets.has(outlet)) {
        this.openDrawer(drawer);
      } else {
        this.closeDrawer(drawer);
      }
    });
  }

  private ensureOutletsAreObserved(): void {
    if (!this.outletChangeSubscription) {
      this.outletChangeSubscription = this.outletService.activeOutlets.subscribe(
        activeOutlets => {
          this.updateDrawers(activeOutlets);
        }
      );
      this.updateDrawers(this.outletService.activeOutletsSnapshot);
    }
  }

  private unsubscribeOutlets(): void {
    if (this.outletChangeSubscription) {
      this.outletChangeSubscription.unsubscribe();
      this.outletChangeSubscription = null;
    }
  }

}
