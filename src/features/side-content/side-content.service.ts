
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, NavigationEnd, Router, RouterStateSnapshot} from "@angular/router";

/**
 * This service manages the side content.
 * This is usually the left side which is a 'side nav' and the right side which shows detail information.
 */
@Injectable()
export class SideContentService {

  public navigationOpen : boolean = false;
  public sideContentOpen : boolean = false;

  constructor(
    private router: Router,
  ){

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(event => event as NavigationEnd)
      .subscribe(event => {

        if(this.isOutletActive('side')){
          console.info('side outlet is active -> showing side content!');
          this.showSideContent();
        }else{
          console.info('side outlet is NOT active -> HIDING side content!');
          this.closeSideContent();
        }
        this.closeSideNav();
      });
  }


  public toggleSidenav(){
    this.navigationOpen = !this.navigationOpen;
  }

  public closeSideNav(){
    this.navigationOpen = false;
  }

  public closeSideContent() {
    console.log('hiding side content ...');
    this.sideContentOpen = false;
    this.router.navigate([{outlets: {'side': null}}])
  }


  isOutletActive(outlet : string) : boolean{
    let rs : RouterStateSnapshot =  this.router.routerState.snapshot;
    let snap : ActivatedRouteSnapshot = rs.root;
    return this.isOutletActiveRecursive(snap, outlet);
  }

  isOutletActiveRecursive(root : ActivatedRouteSnapshot, outlet : string) : boolean{

    console.log('--> ' + root.outlet);

    if(root.outlet === outlet){
      return true;
    }

    for(let c of root.children){
      if(this.isOutletActiveRecursive(c, outlet)){
        return true;
      }
    }
    return false;
  }

  private showSideContent() {
    console.log('showing side content ...');
    this.sideContentOpen = true;
  }

}
