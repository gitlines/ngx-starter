import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute} from "@angular/router";
import {BreadcrumbService, IBreadcrumb} from "./breadcrumb.service";




@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  private ROUTE_DATA_BREADCRUMB: string = "breadcrumb";
  public breadcrumbs: IBreadcrumb[];

  /**
   * @class DetailComponent
   * @constructor
   */
  constructor(
    private breadcrumbService : BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute

  ) {
    this.breadcrumbs = [];
  }

  /**
   * Let's go!
   *
   * @class DetailComponent
   * @method ngOnInit
   */
  ngOnInit() {
    //subscribe to the NavigationEnd event
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(event => event as NavigationEnd)
      .subscribe(event => {

        let url = event.urlAfterRedirects ? event.urlAfterRedirects : event.url;
        this.updateBreadcrumbs(url);
      });

    this.updateBreadcrumbs(location.pathname);
  }

  private updateBreadcrumbs(url :  string) : void {
    this.breadcrumbs = this.getBreadcrumbs(url);
  }

  private getBreadcrumbs(url : string) : IBreadcrumb[] {
    return this.breadcrumbService.generateBreadcrumbs(url);
  }
}



