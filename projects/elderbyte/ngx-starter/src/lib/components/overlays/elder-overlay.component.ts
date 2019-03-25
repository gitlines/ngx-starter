import {
  ChangeDetectionStrategy,
  Component,
  EmbeddedViewRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Platform} from '@angular/cdk/platform';
import {DOCUMENT} from '@angular/common';
import {ViewportRuler} from '@angular/cdk/scrolling';
import {Overlay, OverlayPositionBuilder, OverlayRef, OverlaySizeConfig, PositionStrategy} from '@angular/cdk/overlay';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {TemplatePortal} from '@angular/cdk/portal';
import {FlexibleConnectedPositionStrategyOrigin} from '@angular/cdk/overlay/typings/position/flexible-connected-position-strategy';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'elder-overlay',
  exportAs: 'elderOverlay',
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElderOverlayComponent implements OnInit, OnDestroy {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderOverlayComponent');

  private readonly overlayRef: OverlayRef;
  private readonly positionBuilder: OverlayPositionBuilder;
  private readonly unsubscribe$ = new Subject();

  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private viewContainer: ViewContainerRef,
    private overlay: Overlay,
    private viewportRuler: ViewportRuler,
    @Inject(DOCUMENT) private document: any,
    private platform: Platform
  ) {

    this.positionBuilder = new OverlayPositionBuilder(viewportRuler, document, platform);

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      panelClass: 'mat-elevation-z5',
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });
  }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/


  public ngOnInit(): void {
    this.overlayRef.backdropClick().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(ev => this.closeOverlay());

    this.overlayRef.keydownEvents().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(ev => {
        if (ev.key === 'Escape') {
          this.closeOverlay();
        }
      });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.overlayRef.dispose();
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  @Input()
  public set elderOverlayOrigin(origin: FlexibleConnectedPositionStrategyOrigin) {
    this.elderOverlayPositionStrategy = this.displayUnder(origin);
  }

  @Input()
  public set elderOverlayPositionStrategy(strategy: PositionStrategy) {
    this.overlayRef.updatePositionStrategy(strategy);
  }

  @Input()
  public set elderOverlaySize(size: OverlaySizeConfig) {
    this.overlayRef.updateSize(size);
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Show this overlay
   */
  public showOverlay(): EmbeddedViewRef<any> {
    return this.createOverlay();
  }

  /**
   * Hide this overlay
   */
  public closeOverlay(): any {
    this.overlayRef.detach();
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private displayUnder(origin: FlexibleConnectedPositionStrategyOrigin): PositionStrategy {
    return this.positionBuilder.flexibleConnectedTo(origin)
      .withPositions([{
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 10
    }]);
  }

  private createOverlay(): EmbeddedViewRef<any> {

    const searchPanelPortal = new TemplatePortal(
      this.templateRef,
      this.viewContainer
    );

    return this.overlayRef.attach(searchPanelPortal);
  }
}
