import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'elder-nav-link, ebs-nav-link',
  templateUrl: './elder-nav-link.component.html',
  styleUrls: ['./elder-nav-link.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush Fix RouterLinkActive binding first :(
})
export class ElderNavLinkComponent implements OnInit {

  @HostBinding('attr.tabindex') tabIndex = -1;

  public routerLink$ = new BehaviorSubject<string>('');
  public href$ = new BehaviorSubject<string>('');
  public target$ = new BehaviorSubject<string>('_blank');

  @Input()
  public title: string;

  @Input()
  public set routerLink(value: string) {
    this.routerLink$.next(value);
  }

  @Input()
  public set href(value: string) {
    this.href$.next(value);
  }

  @Input()
  public set target(value: string) {
    this.target$.next(value);
  }

  @Input()
  public icon: string;

  @Input()
  public fontIcon: string;

  @Input()
  public fontSet: string;

  @Input()
  public svgIcon: string;

  constructor() { }

  ngOnInit() {
  }


  // If neither routerLink nor href is defined, we fallback to simple button.
  public get fallbackToButton$(): Observable<boolean> {
    return combineLatest(
      this.routerLink$,
      this.href$
    )
      .pipe(
        map((result) => !result[0] && !result[1])
      );
  }


}
