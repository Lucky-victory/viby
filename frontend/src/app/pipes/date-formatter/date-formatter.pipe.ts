import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'dateFormatter',
})
export class DateFormatterPipe implements PipeTransform {
  transform(
    value: string | number | Date,
    timeFormat: string = 'hh:mm A',
    dateFormat: string = 'MMM D, YYYY'
  ): string {
    const dateVal = moment(value);
    // in other to get an accurate comparison, set both times to midnight
    const currentDate = moment(new Date().setHours(0, 0, 0, 0));
    const recievedDate = moment(new Date(value).setHours(0, 0, 0, 0));
    // compare the days difference
    const dateDiff = currentDate.diff(recievedDate, 'days');
    const time = moment(value).format(timeFormat);

    let transformedDate = '';
    if (dateDiff < 1) {
      transformedDate = `Today ${time}`;
    } else if (dateDiff >= 1 && dateDiff < 2) {
      transformedDate = 'Yesterday ' + time;
    } else {
      transformedDate = dateVal.format(`${dateFormat} ${timeFormat}`);
    }

    return transformedDate;
  }
}
