import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
    selector: 'elder-access-denied, ebs-access-denied',
    templateUrl: './elder-access-denied.component.html',
    styleUrls: ['./elder-access-denied.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElderAccessDeniedComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
