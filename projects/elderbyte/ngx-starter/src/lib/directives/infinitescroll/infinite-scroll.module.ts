
import {NgModule} from '@angular/core';
import {InfiniteScrollDirective} from './infinite-scroll.directive';
import {CommonModule} from '@angular/common';

export {InfiniteScrollDirective} from './infinite-scroll.directive';

@NgModule({
    declarations: [
        InfiniteScrollDirective
    ],
    exports : [
        InfiniteScrollDirective
    ],
    imports : [ CommonModule ]
})
export class InfiniteScrollModule { }
