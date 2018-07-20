import { TestBed, inject } from '@angular/core/testing';

import { NgxStarterService } from './ngx-starter.service';

describe('NgxStarterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxStarterService]
    });
  });

  it('should be created', inject([NgxStarterService], (service: NgxStarterService) => {
    expect(service).toBeTruthy();
  }));
});
