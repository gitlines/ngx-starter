
import {Pipe, PipeTransform} from '@angular/core';


/**
 * Shows a duration in an approximated, human friendly way.
 * Based on time-ago pipe.
 */
@Pipe({
  name: 'caTimeDuration',
  pure: false
})
export class TimeDurationPipe implements PipeTransform {

  constructor() {}


  transform(value = 0, unit = 's', precision: number = null) {

    if (isNaN(parseFloat(String(value))) || !isFinite(value)) { return '?'; }

    // 10−3 s	ms	millisecond	103 s	ks	kilosecond
    // 10−6 s	µs	microsecond	106 s	Ms	megasecond
    // 10−9 s	ns	nanosecond

    let ns = 0;
    switch (unit) {
      case 'ns': ns = value; break;
      case 'micro':
      case 'µs' : ns = value * 1000; break;
      case 'ms': ns = value * 1000 * 1000; break;
      case 's' : ns = value * 1000 * 1000 * 1000; break;
      default: throw new Error(`Unknown input unit in weight pipe: '${unit}'`);
    }

    const nanoseconds = ns;
    const microseconds = nanoseconds / 1000.0;
    const milliseconds = microseconds / 1000.0;
    const seconds = milliseconds / 1000.0;
    const minutes = seconds / 60.0;
    const hours = minutes / 60.0;
    const days = hours / 24.0;
    const months = days / 30.416;
    const years = days / 365;

    if (nanoseconds <= 999) {
      return this.format(nanoseconds, precision || 0) + ' ns';
    } else if (microseconds <= 999) {
      return this.format(microseconds, precision  || 0) + ' µs';
    } else if (milliseconds <= 999) {
      return this.format(milliseconds, precision || 0) + ' ms';
    } else if (seconds <= 59) {
      return this.format(seconds, precision || 0) + ' seconds';
    } else if (seconds <= 90) {
      return 'a minute';
    } else if (minutes <= 45) {
      return this.format(minutes, precision || 0) + ' minutes';
    } else if (minutes <= 90) {
      return 'an hour';
    } else if (hours <= 22) {
      return this.format(hours, precision || 1) + ' hours';
    } else if (hours <= 36) {
      return 'a day';
    } else if (days <= 25) {
      return this.format(days, precision || 1) + ' days';
    } else if (days <= 45) {
      return 'a month';
    } else if (days <= 345) {
      return this.format(months, precision || 1) + ' months';
    } else if (days <= 545) {
      return 'a year';
    } else { // (days > 545)
      return this.format(years, precision || 1) + ' years';
    }
  }


  private format(value: number, precision: number): number {
    return +value.toFixed(precision);
  }
}
