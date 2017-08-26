import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiAutocompleteComponent } from './multi-autocomplete.component';

describe('MultiAutocompleteComponent', () => {
  let component: MultiAutocompleteComponent;
  let fixture: ComponentFixture<MultiAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiAutocompleteComponent ]
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
