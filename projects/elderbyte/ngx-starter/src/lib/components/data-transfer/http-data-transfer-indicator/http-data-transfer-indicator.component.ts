import {ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {flatMap, map, startWith} from 'rxjs/operators';
import {FlexibleConnectedPositionStrategy, Overlay, OverlayRef, ViewportRuler} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {Platform} from '@angular/cdk/platform';
import {DOCUMENT} from '@angular/common';
import {ElderDataTransferService} from '../elder-data-transfer.service';
import {DataTransferState} from '../../../common/http/transfer/data-transfer-state';

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

  public activeUploads$: Observable<DataTransferState[]>;


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

    this.activeUploads$ = this.transferService.transfers.pipe(
      map(transfers => transfers.map(t => t.state$)),
      flatMap(states => combineLatest(states)),
      map(states => states.filter(s => !s.isDone)),
      startWith([])
    );

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
