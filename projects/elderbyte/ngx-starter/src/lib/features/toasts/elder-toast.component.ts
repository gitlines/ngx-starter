import {Component, OnInit} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {Subscription} from 'rxjs';
import {ElderToastService} from './elder-toast.service';
import {Toast} from './toast';

@Component({
  selector: 'elder-toast',
  template: ''
})
export class ElderToastComponent implements OnInit {


  private subscription: Subscription;

  constructor(private toastService: ElderToastService,
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
