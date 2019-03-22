import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Observable} from 'rxjs';
import {FlexibleConnectedPositionStrategy, Overlay, OverlayRef, ViewportRuler} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {Platform} from '@angular/cdk/platform';
import {DOCUMENT} from '@angular/common';
import {ElderDataTransferService} from '../elder-data-transfer.service';
import {DataTransferProgressAggregate} from '../../../common/http/transfer/data-transfer-progress-aggregate';

@Component({
  selector: 'elder-data-transfer-indicator',
  templateUrl: './http-data-transfer-indicator.component.html',
  styleUrls: ['./http-data-transfer-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HttpDataTransferIndicatorComponent implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  @Input()
  public activeColor = 'primary';

  @Input()
  public inactiveColor = '';

  public aggregate$: Observable<DataTransferProgressAggregate>;

  private overlayRef: OverlayRef;

  /** The detail panel */
  @ViewChild('panel') panel: TemplateRef<any>;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private transferService: ElderDataTransferService,
    private overlay: Overlay,
    private viewContainer: ViewContainerRef,
    private viewportRuler: ViewportRuler,
    @Inject(DOCUMENT) private document: any,
    private platform: Platform,
    private element: ElementRef
  ) { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {

    this.aggregate$ = this.transferService.transferAggregate;

    this.overlayRef = this.overlay.create({

      /*
      height: this.height,
      width: this.width,
      maxWidth: this.maxWidth,
      maxHeight: this.maxHeight,
      minWidth: this.minWidth,
      minHeight: this.minHeight,
      */

      hasBackdrop: true,
      panelClass: 'mat-elevation-z5',
      positionStrategy: new FlexibleConnectedPositionStrategy(
        this.element,
        this.viewportRuler,
        this.document,
        this.platform
      ).withPositions([{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: 10
      }])
    });

    this.overlayRef.backdropClick()
      .subscribe(ev => this.closePanel());

    this.overlayRef.keydownEvents()
      .subscribe(ev => {
        if (ev.key === 'Escape') {
          this.closePanel();
        }
      });
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  public showPanel(event: any): void {
    this.createOverlay();
  }

  public closePanel() {
    this.overlayRef.detach();
  }

  /**************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private createOverlay(): void {
    const searchPanelPortal = new TemplatePortal(
      this.panel,
      this.viewContainer
    );
    const viewRef = this.overlayRef.attach(searchPanelPortal);
  }

}
