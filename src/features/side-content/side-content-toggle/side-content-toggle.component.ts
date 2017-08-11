import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {SideContentService} from '../side-content.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-side-content-toggle',
  templateUrl: './side-content-toggle.component.html',
  styleUrls: ['./side-content-toggle.component.scss']
})
export class SideContentToggleComponent implements OnInit, OnDestroy {

  private sub: Subscription;
  public isMainRoute: boolean;

  constructor(
      private router: Router,
      private sideContentService: SideContentService,
  ) { }

  ngOnInit() {

    this.sub = this.router.events.subscribe((event) => {

        if (event instanceof NavigationEnd) {

            let navEnd = event as NavigationEnd;
            let url = navEnd.url;
            let parts = url.split('/');

            let index = parts.indexOf('orders');

            if (index < 0 || index === parts.length - 1) {
                this.isMainRoute = true;
            }else {
                this.isMainRoute = false;
            }
        }
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }


  public toggleSideContent() {
      this.sideContentService.toggleSidenav();
  }

  public goBack() {
      this.router.navigate(['app/orders']);
  }


}
