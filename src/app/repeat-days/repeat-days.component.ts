import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-repeat-days',
  templateUrl: './repeat-days.component.html',
  styleUrls: ['./repeat-days.component.css']
})
export class RepeatDaysComponent implements OnInit {
  @Output() public selectedDay: EventEmitter<{ status: boolean, day: number }> = new EventEmitter();

  public days: Array<string> = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ];

  constructor() { }

  ngOnInit() { }

  public chooseDay(i: number, e: Event): void {
    this.toggleDaySelection(e, i);
  }

  private toggleDaySelection(e: any, i: number): void {
    const elClassList = e.target.classList;

    if (elClassList.contains('__app-repeat__day-item--selected')) {
      elClassList.remove('__app-repeat__day-item--selected');
      this.selectedDay.emit({ status: false, day: i });
    } else {
      elClassList.add('__app-repeat__day-item--selected');
      this.selectedDay.emit({ status: true, day: i });
    }
  }
}
