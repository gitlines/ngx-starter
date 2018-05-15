import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {CanColor, mixinColor} from '@angular/material';



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
    'class': 'box',
  }
})
export class MatPanelComponent extends _MatPanelMixinBase implements OnInit, CanColor {

  constructor(renderer: Renderer2, elementRef: ElementRef) {
    super(renderer, elementRef);
  }

  ngOnInit() {
  }

}
