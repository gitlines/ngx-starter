import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
    selector: 'ebs-access-denied',
    templateUrl: './ebs-access-denied.component.html',
    styleUrls: ['./ebs-access-denied.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbsAccessDeniedComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
