import { Injectable } from '@angular/core';
import {MatDrawer} from '@angular/material';
import {ElderRouterOutletService} from './elder-router-outlet.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {LoggerFactory} from '@elderbyte/ts-logger';

@Injectable({
  providedIn: 'root'
})
export class ElderRouteOutletDrawerService {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderRouteOutletDrawerService');

  private _outletChangeSubscription: Subscription;
  private readonly _outletDrawers = new Map<string, MatDrawer>();
  private readonly _drawerVisibility = new Subject<MatDrawer>();

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private outletService: ElderRouterOutletService
  ) { }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get drawerVisibilityChange(): Observable<MatDrawer> {
    return this._drawerVisibility.asObservable();
  }

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

    this._outletDrawers.set(routeOutlet, drawer);

    this.ensureOutletsAreObserved();
  }

  public findDrawer(routeOutlet: string): MatDrawer {
    return this._outletDrawers.get(routeOutlet);
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
    const toggleResult = drawer.open('program');
    this._drawerVisibility.next(drawer);
    return toggleResult;
  }

  private closeDrawer(drawer: MatDrawer): Promise<any> {
    const toggleResult = drawer.close();
    this._drawerVisibility.next(drawer);
    return toggleResult;
  }

  private updateDrawers(activeOutlets: Set<string>): void {
    this._outletDrawers.forEach((drawer, outlet) => {
      if (activeOutlets.has(outlet)) {
        this.openDrawer(drawer);
      } else {
        this.closeDrawer(drawer);
      }
    });
  }

  private ensureOutletsAreObserved(): void {
    if (!this._outletChangeSubscription) {
      this._outletChangeSubscription = this.outletService.activeOutlets.subscribe(
        activeOutlets => {
          this.updateDrawers(activeOutlets);
        }
      );
      this.updateDrawers(this.outletService.activeOutletsSnapshot);
    }
  }

  private unsubscribeOutlets(): void {
    if (this._outletChangeSubscription) {
      this._outletChangeSubscription.unsubscribe();
      this._outletChangeSubscription = null;
    }
  }

}
