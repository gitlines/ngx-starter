import { Injectable } from '@angular/core';
import {debounceTime, filter, map} from 'rxjs/operators';
import {ActivatedRouteSnapshot, NavigationEnd, NavigationExtras, Router, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {Sets} from '../../../common/sets';
import {LoggerFactory} from '@elderbyte/ts-logger';

@Injectable({
  providedIn: 'root'
})
export class RouterOutletService {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('RouterOutletService');

  private _activeOutlets: BehaviorSubject<Set<string>> = null;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private router: Router,
  ) {
  }
  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Emits the current active outlets over time
   */
  public get activeOutlets(): Observable<Set<string>> {
    this.ensureListener();
    return this._activeOutlets.asObservable();
  }

  /**
   * Gets a snapshot of the current active outlets
   */
  public get activeOutletsSnapshot(): Set<string> {
    this.ensureListener();
    return this._activeOutlets.value;
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Checks if the given outlet is currently active
   */
  public isActive(outlet: string): boolean {
    return this.activeOutletsSnapshot.has(outlet);
  }

  /**
   * Deactivates the given outlet
   */
  public deactivate(outlet: string): Promise<boolean> {

    if (this.isActive(outlet)) {
      const command: any = {};
      command['outlets'] = {};
      command['outlets'][outlet] = null;

      return this.router.navigate([
        command
      ]);
    } else {
      return Promise.resolve(false);
    }
  }

  /**
   * Activates the given outlet route with the given path
   * @param outlet
   * @param parts
   * @param extras
   */
  public activate(outlet: string, parts: string[], extras?: NavigationExtras): Promise<boolean> {
    const command: any = {};
    command['outlets'] = {};
    command['outlets'][outlet] = parts;
    return this.router.navigate([command], extras);
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private ensureListener(): void {
    if (!this._activeOutlets) {
      this._activeOutlets = new BehaviorSubject<Set<string>>(this.collectActiveOutlets());

      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        debounceTime(60),
        map(event => event as NavigationEnd)
      ).subscribe(event => {
        this.updateActiveOutlets();
      });
    }
  }

  private updateActiveOutlets(): void {
    const found = this.collectActiveOutlets();
    const current = this.activeOutletsSnapshot;
    if (!Sets.equals(found, current)) {
      this._activeOutlets.next(found);
    }
  }

  private collectActiveOutlets(): Set<string> {
    const rs: RouterStateSnapshot =  this.router.routerState.snapshot;
    const snap: ActivatedRouteSnapshot = rs.root;
    return this.collectActiveOutletsFor(snap);
  }

  private collectActiveOutletsFor(root: ActivatedRouteSnapshot): Set<string> {
    const outlets = new Set<string>();
    this.collectActiveOutletsRecursive(root, outlets);
    return outlets;
  }

  private collectActiveOutletsRecursive(snap: ActivatedRouteSnapshot, outlets: Set<string>): void {
    outlets.add(snap.outlet);
    for (const c of snap.children) {
      this.collectActiveOutletsRecursive(c, outlets);
    }
  }
}
