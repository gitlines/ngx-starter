import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiAutocompleteComponent } from './multi-autocomplete.component';
import {MultiAutoCompleteModule} from './index';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';

describe('MultiAutocompleteComponent', () => {
  let component: MultiAutocompleteComponent;
  let fixture: ComponentFixture<MultiAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MultiAutoCompleteModule],
        providers: [{provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
