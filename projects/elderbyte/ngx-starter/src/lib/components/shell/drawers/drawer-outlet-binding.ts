import {RouterOutlet} from '@angular/router';
import {MatDrawer} from '@angular/material';
import {Subscription} from 'rxjs';

export class DrawerOutletBinding {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private _subs: Subscription[] = [];

  /***************************************************************************
   *                                                                         *
   * Static Builder                                                          *
   *                                                                         *
   **************************************************************************/

  /**
   * Creates a binding between the given router-outlet and the drawer.
   * @param routerOutlet
   * @param drawer
   */
  public static bind(routerOutlet: RouterOutlet, drawer: MatDrawer): DrawerOutletBinding {
    const binding = new DrawerOutletBinding(routerOutlet, drawer);
    binding.bind();
    return binding;
  }

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  private constructor(
    private readonly routerOutlet: RouterOutlet,
    private readonly drawer: MatDrawer
  ) {
    if (!routerOutlet) { throw new Error('routerOutlet must not be null!'); }
    if (!drawer) { throw new Error('drawer must not be null!'); }
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public bind(): void {
    this._subs = [
      this.routerOutlet.activateEvents.subscribe(
        () => { this.drawer.open(); }
      ),
      this.routerOutlet.deactivateEvents.subscribe(
        () => { this.drawer.close(); }
      ),
    ];

    if (this.routerOutlet.isActivated) {
      this.drawer.open();
    } else {
      this.drawer.close();
    }
  }

  public unbind(): void {
    this._subs.forEach(s => s.unsubscribe());
    this._subs = [];
  }
}
