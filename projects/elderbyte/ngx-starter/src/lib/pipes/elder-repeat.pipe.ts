import {PipeTransform, Pipe} from '@angular/core';

@Pipe({name: 'elderRepeat'})
export class ElderRepeatPipe implements PipeTransform {
  transform(value: number): any {
    const iterable = <Iterable<any>> {};
    iterable[Symbol.iterator] = function* () {
      let n = 0;
      while (n < value) {
        yield ++n;
      }
    };
    return iterable;
  }
}

