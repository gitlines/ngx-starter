import {Component, ContentChild, Directive, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {EbsSideContentService} from '../../../features/side-content/ebs-side-content.service';


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

@Component({
  selector: 'ebs-shell',
  templateUrl: './ebs-shell.component.html',
  styleUrls: ['./ebs-shell.component.scss']
})
export class EbsShellComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  @ContentChild(EbsShellSideLeftDirective, {read: TemplateRef})
  public sideContentLeft: TemplateRef<any>;

  @ContentChild(EbsShellSideRightDirective, {read: TemplateRef})
  public sideContentRight: TemplateRef<any>;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private sideContentService: EbsSideContentService,
  ) { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {

  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public get leftSideContentOpen(): boolean {
    return this.sideContentService.navigationOpen;
  }

  public closeLeftSideContent() {
    this.sideContentService.closeSideNav();
  }

  // ---

  public get sideContentOpen(): boolean {
    return this.sideContentService.sideContentOpen;
  }

  public get disableClose(): boolean {
    return false;
    // return this.sideContentService.clickOutsideToClose;
  }

  public closeSideNav() {
    this.sideContentService.closeSideNav();
  }

  public closeSideContent() {
    this.sideContentService.closeSideContent();
  }

}
