import { TestBed, inject } from '@angular/core/testing';
import {ToastService} from './toast.service';
import {ToastModule} from './index';
import {TranslateModule} from '@ngx-translate/core';

describe('ToastService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastModule.forRoot(), TranslateModule.forRoot()],
    });
  });

  it('should ...', inject([ToastService], (service: ToastService) => {
    expect(service).toBeTruthy();
  }));
});
