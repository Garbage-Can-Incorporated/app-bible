import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'repeatDays'
})
export class RepeatDaysCuratorPipe implements PipeTransform {
  private daysString = <string> '';

  transform(days: Array<number>, time: number): any {
    this.daysString = '';

    if (days) {
      days.map((cur: number) => {
        this.switchValue(cur);
      });
    }

    this.daysString = this.daysString.trimLeft()
      .trimRight()
      .replace(/\s/gi, ', ');

    if (this.daysString.split(', ').length === 7) {
      return 'Everyday';
    }

    if (this.daysString === '' || this.daysString === ' ') {
      // time.hours is greater than present_time.hours === today
      if (
        new Date(time).getHours() >= new Date().getHours()
      ) {
        return 'Today';
      } else if (
        // equal hours
        new Date(time).getHours() === new Date().getHours()
      ) {
        if (
          new Date(time).getMinutes() >= new Date().getMinutes()
        ) { return 'Today'; }
      }  else { return 'Tomorrow'; }
    } else {
      return this.daysString;
    }
  }

  private switchValue(val: number): void {
    switch (val) {
      case 0:
        this.daysString = this.daysString.concat(' Sunday');
        break;

      case 1:
        this.daysString = this.daysString.concat(' Monday');
        break;

      case 2:
        this.daysString = this.daysString.concat(' Tuesday');
        break;

      case 3:
        this.daysString = this.daysString.concat(' Wednesday');
        break;

      case 4:
        this.daysString = this.daysString.concat(' Thursday');
        break;

      case 5:
        this.daysString = this.daysString.concat(' Friday');
        break;

      case 6:
        this.daysString = this.daysString.concat(' Saturday');
        break;

      default:
        break;
    }
  }
}
