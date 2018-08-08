import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {CanColor, mixinColor} from '@angular/material';
import {ThemePalette} from '@angular/material/core/typings/common-behaviors/color';



export class MatPanelComponentBase {
  constructor(public _renderer: Renderer2, public _elementRef: ElementRef) {}
}

export const _MatPanelMixinBase = mixinColor(MatPanelComponentBase);

@Component({
  selector: 'mat-panel',
  templateUrl: './mat-panel.component.html',
  inputs: ['color'],
  styleUrls: ['./mat-panel.component.scss'],
  host: {
    'class': 'mat-panel',
  }
})
export class MatPanelComponent extends _MatPanelMixinBase implements OnInit, CanColor {

  @Input()
  public color: ThemePalette; // Fix CanColor interface issue

  constructor(renderer: Renderer2, elementRef: ElementRef) {
    super(renderer, elementRef);
  }

  ngOnInit() {
  }

}
