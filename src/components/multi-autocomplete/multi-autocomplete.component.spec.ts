import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiAutocompleteComponent } from './multi-autocomplete.component';
import {MultiAutoCompleteModule} from './index';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('MultiAutocompleteComponent', () => {
  let component: MultiAutocompleteComponent;
  let fixture: ComponentFixture<MultiAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MultiAutoCompleteModule]
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
