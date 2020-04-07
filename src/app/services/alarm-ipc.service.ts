import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ElectronService } from 'ngx-electron';

import { IAlarmDetail } from '../interfaces/i-alarm-detail';

@Injectable({
  providedIn: 'root'
})
export class AlarmIpcService {
  private allAlarmsSubject: Subject<Array<IAlarmDetail>> = new Subject();
  private addAlarmSubject: Subject<Array<IAlarmDetail>> = new Subject();
  private editAlarmSubject: Subject<{ message: string }> = new Subject();
  private repeatDayRespSubject: Subject<{ message: string }> = new Subject();
  private deleteAlarmSubject: Subject<{ message: string }> = new Subject();

  constructor(
    private _electron?: ElectronService,
  ) { }

  public deleteAlarm(data: {i: number}): void {
    this._electron.ipcRenderer
      .send('delete-alarm', data);

    this._electron.ipcRenderer
      .on('delete-alarm-success', (_, _data) => {
        this.deleteAlarmSubject.next(_data);
      });
  }

  public repeatDayChanged(): void {
    this._electron.ipcRenderer
      .on('repeat-day-response', (e, data) => {
        this.repeatDayRespSubject.next(data);
      });
  }

  public removeRepeatDay(data: { i: number, day: number }): void {
    this._electron.ipcRenderer
      .send(
        'remove-repeat-day',
        data,
      );
  }

  public addRepeatDay(data: { i: number, day: number }): void  {
    this._electron.ipcRenderer
      .send(
        'add-repeat-day',
        data,
      );
  }

  public editAlarmProp(data: {i: number, [key: string]: any}): void {
    this._electron.ipcRenderer
      .send(
        'edit-alarm-prop',
        data,
      );
  }

  public editComplete(): void {
    this._electron.ipcRenderer
      .on('edit-alarm-prop-success', (e, data) => {
        this.editAlarmSubject.next(data);
      });
  }

  public submitAlarm(alarm: IAlarmDetail): void {
    this._electron.ipcRenderer
      .send('add-alarm', alarm);
  }

  public alarmAdditionSuccess(): void {
    this._electron.ipcRenderer
      .on('add-alarm-success', (e, data) => {
        this.addAlarmSubject.next(data);
      });
  }

  public getAlarms(): void {
    this._electron.ipcRenderer.send('get-all-alarms');

    this._electron.ipcRenderer
      .on('all-alarms', (e, data) => {
        this.allAlarmsSubject.next(data);
      });
  }

  public getSubjects(): { [ key in string ]: Subject<any> } {
    return {
      addAlarmSubject: this.addAlarmSubject,
      allAlarmsSubject: this.allAlarmsSubject,
      editAlarmSubject: this.editAlarmSubject,
      repeatDayRespSubject: this.repeatDayRespSubject,
      deleteAlarmSubject: this.deleteAlarmSubject
    };
  }
}
