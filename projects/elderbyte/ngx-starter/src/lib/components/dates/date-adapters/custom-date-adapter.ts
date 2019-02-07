/** Adapts the native JS Date for use with cdk-based components that work with dates. */
import { NativeDateAdapter } from '@angular/material';

/**
 * Makes week starting at monday. For example MatDatePicker.
 */
export class CustomDateAdapter extends NativeDateAdapter {

  getFirstDayOfWeek(): number {
    return 1;
  }

}
