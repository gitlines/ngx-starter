import { TestBed, inject } from '@angular/core/testing';
import {ToastService} from "./toast.service";


describe('NotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
  });

  it('should ...', inject([ToastService], (service: ToastService) => {
    expect(service).toBeTruthy();
  }));
});
