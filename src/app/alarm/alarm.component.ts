import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { DialogService } from '../services/dialog.service';

import { TimeComponent } from '../time/time.component';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit {
  public setTime: any;

  constructor(
    private _dialog: DialogService
  ) { }

    this.setupListeners();

  public expandCollapse(el: any, days): void {
    const children = el.children[0].children;
    const elClassList = el.classList;

    elClassList
        .toggle('__app-alarm--item__container--background');

    Array.from(children).forEach((cur: Element, i: number) => {
      if (i !== 0) {
        // hiding items
        if (cur.classList.contains('d-flex')) {
          cur.classList.replace('d-flex', 'd-none');
          days.classList.replace('d-none', 'd-flex');
          days.nextSibling.classList.replace('d-none', 'd-flex');
        } else {
          // unhiding items
          cur.classList.replace('d-none', 'd-flex');
          days.classList.replace('d-flex', 'd-none');
          days.nextSibling.classList.replace('d-flex', 'd-none');
        }
      }
    });
  }

  public openAddDialog(): void {
    const dialog = this._dialog
      .openDialog(
        {},
        TimeComponent,
        { height: 'fit-content', disableClose: true }
      );

    dialog.afterClosed()
      .subscribe(
        (data) => {
          console.log({ data });
          if (data) {
            this.setTime = new Date(new Date().setHours(data.hour, data.minute)).toJSON();
          }
        }
  private setupListeners(): void {
    this._alarmIpc.getSubjects()
      .allAlarmsSubject.subscribe(
        (data) => {
          this.alarms = [
            ...(this.alarms !== undefined ? this.alarms : []),
            ...data,
          ];
          console.log({ alarms: this.alarms });
        },
        (error) => console.log({ error })
      );

    this._alarmIpc.getSubjects()
      .addAlarmSubject.subscribe(
        (data) => {
          // show toast or snackbar
          console.log('[Success] Alarm Added!');
        },
        (error) => console.log({ error })
      );
  }
}
