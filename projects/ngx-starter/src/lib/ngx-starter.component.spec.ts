import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxStarterComponent } from './ngx-starter.component';

describe('NgxStarterComponent', () => {
  let component: NgxStarterComponent;
  let fixture: ComponentFixture<NgxStarterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxStarterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxStarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
