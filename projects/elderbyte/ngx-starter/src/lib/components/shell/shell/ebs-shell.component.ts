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
import {EbsSideContentService} from '../../../features/side-content/ebs-side-content.service';
import {MatSidenav} from '@angular/material';
import {RouteOutletDrawerService} from '../drawers/route-outlet-drawer.service';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {ObjectUnsubscribedError, Observable, Subscription} from 'rxjs';


@Directive({selector: '[ebsShellSideLeft]'})
export class EbsShellSideLeftDirective {
  constructor(
    public templateRef: TemplateRef<any>,
    public viewContainer: ViewContainerRef) { }
}

@Directive({selector: '[ebsShellSideRight]'})
export class EbsShellSideRightDirective {
  constructor(
    public templateRef: TemplateRef<any>,
    public viewContainer: ViewContainerRef) { }
}

@Directive({selector: '[ebsShellCenter]'})
export class EbsShellCenterDirective {
  constructor(
    public templateRef: TemplateRef<any>,
    public viewContainer: ViewContainerRef) { }
}

@Component({
  selector: 'ebs-shell',
  templateUrl: './ebs-shell.component.html',
  styleUrls: ['./ebs-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbsShellComponent implements OnInit, OnDestroy {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('EbsShellComponent');

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

  @ContentChild(EbsShellSideLeftDirective, {read: TemplateRef})
  public sideContentLeft: TemplateRef<any>;

  @ContentChild(EbsShellSideRightDirective, {read: TemplateRef})
  public sideContentRight: TemplateRef<any>;

  @ContentChild(EbsShellCenterDirective, {read: TemplateRef})
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
    private sideContentService: EbsSideContentService,
    private outletDrawerService: RouteOutletDrawerService,
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

    this.leftSideContentOpen$ =  this.sideContentService.navigationOpenChange;
  }

  public ngOnDestroy(): void {

  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public closeLeftSideContent() {
    this.sideContentService.closeSideNav();
  }

  public toggleSideNav(): void {
    this.sideContentService.toggleSidenav();
  }

}
