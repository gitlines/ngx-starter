
import {NgModule} from '@angular/core';
import {EbsInfiniteScrollDirective} from './ebs-infinite-scroll.directive';
import {CommonModule} from '@angular/common';

export {EbsInfiniteScrollDirective} from './ebs-infinite-scroll.directive';

@NgModule({
    declarations: [
        EbsInfiniteScrollDirective
    ],
    exports : [
        EbsInfiniteScrollDirective
    ],
    imports : [ CommonModule ]
})
export class EbsInfiniteScrollModule { }
