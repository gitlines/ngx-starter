import {Component, OnInit} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {Subscription} from 'rxjs';
import {EbsToastService} from './ebs-toast.service';
import {Toast} from './toast';

@Component({
  selector: 'ebs-toast',
  template: ''
})
export class EbsToastComponent implements OnInit {


  private subscription: Subscription;

  constructor(private toastService: EbsToastService,
              public snackBar: MatSnackBar) {
  }

  public ngOnInit(): void {
    this.subscription = this.toastService.getNotificationsObservable().subscribe(
      (notification: Toast) => {
        this.snackBar.open(notification.message, 'OK', <MatSnackBarConfig>{duration: 3000});
      }
    );
  }
}
