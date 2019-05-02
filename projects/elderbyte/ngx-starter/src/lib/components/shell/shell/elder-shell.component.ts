import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ElderShellService} from '../elder-shell.service';
import {MatSidenav} from '@angular/material';
import {ElderRouteOutletDrawerService} from '../drawers/elder-route-outlet-drawer.service';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {Observable, Subscription} from 'rxjs';


@Directive({selector: '[elderShellSideLeft], [ebsShellSideLeft]'})
export class ElderShellSideLeftDirective {
  constructor(
    public templateRef: TemplateRef<any>,
    public viewContainer: ViewContainerRef) { }
}

@Directive({selector: '[elderShellSideRight], [ebsShellSideRight]'})
export class ElderShellSideRightDirective {
  constructor(
    public templateRef: TemplateRef<any>,
    public viewContainer: ViewContainerRef) { }
}

@Directive({selector: '[elderShellCenter], [ebsShellCenter]'})
export class ElderShellCenterDirective {
  constructor(
    public templateRef: TemplateRef<any>,
    public viewContainer: ViewContainerRef) { }
}

@Component({
  selector: 'elder-shell, ebs-shell', // ebs-* prefix is deprecated!
  templateUrl: './elder-shell.component.html',
  styleUrls: ['./elder-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElderShellComponent implements OnInit, OnDestroy {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderShellComponent');

  /** Controls if the SideNav toggle should be displayed. Default: true */
  @Input()
  public sideNavToggleEnabled = true;

  @Input()
  public color = 'primary';

  @Input()
  public menuColor = 'accent';

  @Input()
  public leftSideAutoFocus = false;

  @Input()
  public rightSideAutoFocus = false;

  @ContentChild(ElderShellSideLeftDirective, {read: TemplateRef})
  public sideContentLeft: TemplateRef<any>;

  @ContentChild(ElderShellSideRightDirective, {read: TemplateRef})
  public sideContentRight: TemplateRef<any>;

  @ContentChild(ElderShellCenterDirective, {read: TemplateRef})
  public centerContent: TemplateRef<any>;

  @ViewChild('rightSideDetail')
  public rightSideDrawer: MatSidenav;

  public rightSideOutletName = 'side';

  public leftSideContentOpen$: Observable<boolean>;

  private _sub: Subscription;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private shellService: ElderShellService,
    private outletDrawerService: ElderRouteOutletDrawerService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {
    this.outletDrawerService.registerOutletDrawer(
      this.rightSideOutletName,
      this.rightSideDrawer
    );

    this._sub = this.outletDrawerService.drawerVisibilityChange.subscribe(
      drawer =>  this.changeDetectorRef.markForCheck()
    );

    this.leftSideContentOpen$ =  this.shellService.navigationOpenChange;
  }

  public ngOnDestroy(): void {

  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public closeLeftSideContent() {
    this.shellService.closeSideNav();
  }

  public toggleSideNav(): void {
    this.shellService.toggleSidenav();
  }

  public onBackdropClick(event: any): void {
    if (this.shellService.isSideContentActive()) {
      this.shellService.closeSideContent();
    }
  }

  public onEscapeRightSide(event: any): void {
    if (this.shellService.isSideContentActive()) {
      this.shellService.closeSideContent();
    }
  }

}
