import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { DialogService } from '../services/dialog.service';

import { TimeComponent } from '../time/time.component';

import { AlarmIpcService } from '../services/alarm-ipc.service';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit {
  public setTime: any;
  public alarms: any[];

  constructor(
    private _dialog: DialogService,
    private _alarmIpc: AlarmIpcService
  ) { }

  ngOnInit() {
    this._alarmIpc.getAlarms();
    this._alarmIpc.alarmAdditionSuccess();
    this.setupListeners();
  }

  public openAlarmTimeDialog(time: Date, e: Event, i: number): void {
    e.stopImmediatePropagation();

    const dialog = this._dialog
      .openDialog(
        {
          hour: new Date(time).getHours(),
          minute: new Date(time).getMinutes(),
        },
        TimeComponent,
        { height: 'fit-content', disableClose: true }
    );

    dialog.afterClosed()
      .subscribe(
        (data) => {
          if (data) {
            this.setTime = new Date(
              new Date().setHours(data.hour, data.minute)
            ).toJSON();

            this.alarms[ i ].time = new Date(this.setTime).getTime();
          }
        }
      );
  }

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
          if (data) {
            this.setTime = new Date(
              new Date().setHours(data.hour, data.minute)
            ).toJSON();

            this._alarmIpc.submitAlarm({
              time: new Date(this.setTime).getTime(),
              status: true,
              repeat: false,
              days: [],
              label: ''
            });
          }
        }
      );
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
