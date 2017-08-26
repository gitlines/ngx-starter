
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

  transform(value: string) {

    const seconds = parseInt(value);
    const minutes = Math.round(Math.abs(seconds / 60));
    const hours = Math.round(Math.abs(minutes / 60));
    const days = Math.round(Math.abs(hours / 24));
    const months = Math.round(Math.abs(days / 30.416));
    const years = Math.round(Math.abs(days / 365));


    if (seconds <= 59) {
      return seconds + ' seconds';
    } else if (seconds <= 90) {
      return 'a minute';
    } else if (minutes <= 45) {
      return minutes + ' minutes';
    } else if (minutes <= 90) {
      return 'an hour';
    } else if (hours <= 22) {
      return hours + ' hours';
    } else if (hours <= 36) {
      return 'a day';
    } else if (days <= 25) {
      return days + ' days';
    } else if (days <= 45) {
      return 'a month';
    } else if (days <= 345) {
      return months + ' months';
    } else if (days <= 545) {
      return 'a year';
    } else { // (days > 545)
      return years + ' years';
    }

  }
}
