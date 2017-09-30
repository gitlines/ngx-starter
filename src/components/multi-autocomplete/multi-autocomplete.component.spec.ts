import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiAutocompleteComponent } from './multi-autocomplete.component';
import {MultiAutoCompleteModule} from './index';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';

describe('MultiAutocompleteComponent', () => {
  let component: MultiAutocompleteComponent;
  let fixture: ComponentFixture<MultiAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MultiAutoCompleteModule],
        providers: [
            {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
            LoggerModule.forRoot({
                level: NgxLoggerLevel.DEBUG,
                serverLogLevel: NgxLoggerLevel.OFF
            })
            ]
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
