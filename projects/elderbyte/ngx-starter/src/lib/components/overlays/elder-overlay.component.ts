import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EmbeddedViewRef,
  Inject,
  Input,
  OnDestroy,
  OnInit, Output,
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
import {merge, Observable, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';


export class OverlayShowOptions {
  public source?: ElementRef;
}


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

  private _hasCustomPositionStrategy = false;
  private _origin: FlexibleConnectedPositionStrategyOrigin | null = null;

  @Input()
  public originX: 'start' | 'center' | 'end' = 'start';

  @Input()
  public originY: 'top' | 'center' | 'bottom' = 'bottom';

  @Input()
  public overlayX: 'start' | 'center' | 'end' = 'start';

  @Input()
  public overlayY: 'top' | 'center' | 'bottom' = 'top';

  @Input()
  public offsetY = 10;

  @Input()
  public offsetX = 0;

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
  public set origin(origin: FlexibleConnectedPositionStrategyOrigin) {
    this._origin = origin;
  }

  @Input()
  public set positionStrategy(strategy: PositionStrategy) {
    this.overlayRef.updatePositionStrategy(strategy);
    this._hasCustomPositionStrategy = true;
  }

  @Input()
  public set overlaySize(size: OverlaySizeConfig) {
    this.overlayRef.updateSize(size);
  }

  /**
   * Emits all key events on the overlay
   */
  @Output()
  public get keydownEvents() {
    return this.overlayRef.keydownEvents();
  }

  /**
   * Emits when the overlay is attached (true) or de-attached (false)
   */
  @Output()
  public get attachedChange(): Observable<boolean> {
    return merge(
      this.overlayRef.attachments().pipe(map(() => true)),
      this.overlayRef.detachments().pipe(map(() => false))
    );
  }

  /**
   * Is this overlay currently attached and thus visible?
   */
  public get attached(): boolean {
    return this.overlayRef.hasAttached();
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Show this overlay
   */
  public showOverlay(options?: OverlayShowOptions): EmbeddedViewRef<any> {


    if (!this._hasCustomPositionStrategy) {

      let origin: FlexibleConnectedPositionStrategyOrigin;
      if (!this._origin && options && options.source) {
        origin = options.source;
      } else {
        origin = this._origin;
      }
      this.overlayRef.updatePositionStrategy(
        this.buildDefaultStrategy(origin)
      );
    }

    if (!this.attached) {
      return this.attachOverlay();
    }
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

  private buildDefaultStrategy(origin: FlexibleConnectedPositionStrategyOrigin): PositionStrategy {
    return this.positionBuilder.flexibleConnectedTo(origin)
      .withPositions([{
        originX: this.originX,
        originY: this.originY,
        overlayX: this.overlayX,
        overlayY: this.overlayY,
        offsetY: this.offsetY,
        offsetX: this.offsetX
      }]);
  }

  private attachOverlay(): EmbeddedViewRef<any> {

    const searchPanelPortal = new TemplatePortal(
      this.templateRef,
      this.viewContainer
    );

    return this.overlayRef.attach(searchPanelPortal);
  }
}
