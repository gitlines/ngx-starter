import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideContentToggleComponent } from './side-content-toggle.component';

describe('SideContentToggleComponent', () => {
  let component: SideContentToggleComponent;
  let fixture: ComponentFixture<SideContentToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideContentToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideContentToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
