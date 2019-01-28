import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {CanColor, ThemePalette, mixinColor} from '@angular/material';
import {Constructor} from '@angular/material/core/typings/common-behaviors/constructor';

export class MatPanelComponentBase {
  constructor(public _renderer: Renderer2, public _elementRef: ElementRef) {}
}

export const _MatPanelMixinBase: Constructor<CanColor> & typeof MatPanelComponentBase =  mixinColor(MatPanelComponentBase);


@Component({
  selector: 'mat-panel',
  templateUrl: './ebs-mat-panel.component.html',
  inputs: ['color'],
  styleUrls: ['./ebs-mat-panel.component.scss'],
  host: {
    'class': 'mat-panel',
  }
})
export class EbsMatPanelComponent extends _MatPanelMixinBase implements OnInit, CanColor {

  @Input()
  public color: ThemePalette; // Fix CanColor interface issue

  constructor(renderer: Renderer2, elementRef: ElementRef) {
    super(renderer, elementRef);
  }

  ngOnInit() {
  }

}
