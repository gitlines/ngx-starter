
import {Directive, NgModule} from '@angular/core';
import {ElderInfiniteScrollDirective} from './elder-infinite-scroll.directive';
import {CommonModule} from '@angular/common';

export {ElderInfiniteScrollDirective} from './elder-infinite-scroll.directive';

/**
 * @deprecated Please switch to ElderInfiniteScrollDirective
 */
@Directive({ selector: '[infiniteScroll]' })
export class ElderInfiniteScrollLegacyDirective extends ElderInfiniteScrollDirective { }

@NgModule({
  declarations: [
    ElderInfiniteScrollDirective,
    ElderInfiniteScrollLegacyDirective
  ],
  exports : [
    ElderInfiniteScrollDirective,
    ElderInfiniteScrollLegacyDirective
  ],
  imports : [ CommonModule ]
})
export class ElderInfiniteScrollModule { }



