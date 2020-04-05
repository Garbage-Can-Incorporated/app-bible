import { Component, OnInit } from '@angular/core';

import { DialogService } from '../services/dialog.service';
import { AlarmIpcService } from '../services/alarm-ipc.service';

import { TimeComponent } from '../time/time.component';
import { LabelComponent } from '../label/label.component';

import { IAlarmDetail } from '../interfaces/i-alarm-detail';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit {
  public setTime: string;
  public alarms: Array<IAlarmDetail>;
  private filteredAlarms: Array<IAlarmDetail> = [];
  private i = <number>0;

  constructor(
    private _dialog: DialogService,
    private _alarmIpc: AlarmIpcService
  ) { }

  ngOnInit() {
    this._alarmIpc.getAlarms();
    this._alarmIpc.alarmAdditionSuccess();
    this._alarmIpc.editComplete();

    this.setupListeners();
  }

  public repeatChange(data: any, i: number): void {
    this.alarms[ i ].repeat = data.checked;

    this._alarmIpc
      .editAlarmProp({ i, repeat: this.alarms[ i ].repeat });
  }

  public statusChange(data: any, i: number): void {
    this.alarms[ i ].status = data.checked;

    this._alarmIpc
      .editAlarmProp({ i, status: this.alarms[ i ].status });
  }

  public setLabel(label: string, i: number): void {
    const dialog = this._dialog
      .openDialog(
        {label: label === '' ? '' : label},
        LabelComponent,
        { height: 'fit-content', disableClose: true }
      );

    dialog.afterClosed()
      .subscribe(
        (data) => {
          if (data) {
            this.alarms[ i ].label = data.label;
            this._alarmIpc
              .editAlarmProp({ i, label: this.alarms[ i ].label });
          }
        }
      );
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
            this._alarmIpc
              .editAlarmProp({ i, time: this.alarms[ i ].time });
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

            this._alarmIpc.getAlarms();
          }
        }
      );
  }

  private setupListeners(): void {
    this._alarmIpc.getSubjects()
      .editAlarmSubject.subscribe(
        (data) => {
          console.log('[Notif] Edit successful');
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

    this._alarmIpc.getSubjects()
      .allAlarmsSubject.subscribe(
        (data) => {
          this.alarms = [
            ...(this.alarms !== undefined ? this.alarms : []),
            ...data,
          ];

          this.trimAlarmItem(this.alarms);
        },
        (error) => console.log({ error })
      );
  }

  public trimAlarmItem(alarms: IAlarmDetail[]): void {
    const cur = alarms[ this.i ];

    const alarmExists = (hosts: IAlarmDetail[], client: IAlarmDetail) => {
      // find current alarm item: client in filtered array: hosts
      const existingAlarm = hosts.find((host: IAlarmDetail) => {
        if (host.id === client.id) {
          return host;
        }
      });

      return existingAlarm ?
        { existence: true } : { existence: false };
    };

    if (cur !== undefined) {
      const doesExist = alarmExists(this.filteredAlarms, cur);

      if (doesExist.existence === false) {
        this.filteredAlarms.push(cur);
      }
      // ignore existing item
    }

    this.i++;
    if (this.i < this.alarms.length) {
      this.trimAlarmItem(alarms);
    }

    if (this.i >= this.alarms.length) {
      this.i = 0;
    }

    this.alarms = [ ...this.filteredAlarms ];
  }
}
