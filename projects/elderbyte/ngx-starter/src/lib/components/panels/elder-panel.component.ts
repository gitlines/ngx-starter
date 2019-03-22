import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {CanColor, ThemePalette, mixinColor} from '@angular/material';
import {Constructor} from '@angular/material/core/typings/common-behaviors/constructor';

export class ElderPanelComponentBase {
  constructor(public _renderer: Renderer2, public _elementRef: ElementRef) {}
}

export const _ElderPanelMixinBase: Constructor<CanColor> & typeof ElderPanelComponentBase =  mixinColor(ElderPanelComponentBase);


@Component({
  selector: 'elder-panel, mat-panel',
  templateUrl: './elder-panel.component.html',
  inputs: ['color'],
  styleUrls: ['./elder-panel.component.scss'],
  host: {
    'class': 'mat-panel',
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElderPanelComponent extends _ElderPanelMixinBase implements OnInit, CanColor {

  @Input()
  public color: ThemePalette; // Fix CanColor interface issue

  constructor(renderer: Renderer2, elementRef: ElementRef) {
    super(renderer, elementRef);
  }

  ngOnInit() {
  }

}
