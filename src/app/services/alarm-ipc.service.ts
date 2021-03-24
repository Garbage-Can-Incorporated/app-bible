import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ElectronService } from 'ngx-electron';
import {SnackbarService} from './snackbar.service';

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
    private snackbar: SnackbarService,
    private _electron?: ElectronService
  ) { }

  public listenDltResp(): void {
    if (this.isElectron) {
      this._electron.ipcRenderer
        .on('delete-alarm-success', (_, _data) => {
          this.deleteAlarmSubject.next(_data);
        });
    } else {
      this.snackbar
        .showSnackbar('This is not an electron app.');
    }
  }

  public deleteAlarm(data: {i: number}): void {
    if (this.isElectron) {
      this._electron.ipcRenderer
        .send('delete-alarm', data);
    } else {
      this.snackbar
        .showSnackbar('This is not an electron app.');
    }
  }

  public repeatDayChanged(): void {
    this._electron.ipcRenderer
      .on('repeat-day-response', (e, data) => {
        this.repeatDayRespSubject.next(data);
      });
  }

  public removeRepeatDay(data: { i: number, day: number }): void {
    if (this.isElectron) {
      this._electron.ipcRenderer
        .send(
          'remove-repeat-day',
          data,
        );
    } else {
      this.snackbar
        .showSnackbar('This is not an electron app.');
    }
  }

  public addRepeatDay(data: {i: number, day: number}): void  {
    if (this.isElectron) {
      this._electron.ipcRenderer
        .send(
          'add-repeat-day',
          data,
        );
    } else {
      this.snackbar
        .showSnackbar('This is not an electron app.');
    }
  }

  public editAlarmProp(data: {i: number, [key: string]: any}): void {
    if (this.isElectron) {
      this._electron.ipcRenderer
        .send(
          'edit-alarm-prop',
          data,
        );
    }  else {
      this.snackbar
        .showSnackbar('This is not an electron app.');
    }
  }

  public editComplete(): void {
    if (this.isElectron) {
      this._electron.ipcRenderer
        .on('edit-alarm-prop-success', (e, data) => {
          this.editAlarmSubject.next(data);
        });
    } else {
      this.snackbar
        .showSnackbar('This is not an electron app.');
    }
  }

  public submitAlarm(alarm: IAlarmDetail): void {
    if (this.isElectron) {
      this._electron.ipcRenderer
        .send('add-alarm', alarm);
    } else {
      this.snackbar
        .showSnackbar('This is not an electron app.');
    }
  }

  public alarmAdditionSuccess(): void {
    if (this.isElectron) {
      this._electron.ipcRenderer
        .on('add-alarm-success', (e, data) => {
          this.addAlarmSubject.next(data);
        });
    } else {
      this.snackbar
        .showSnackbar('This is not an electron app.');
    }
  }

  public getAlarms(): void {
    if (this.isElectron) {
      this._electron.ipcRenderer.send('get-all-alarms');

      this._electron.ipcRenderer
        .on('all-alarms', (_, data) => {
          this.allAlarmsSubject.next(data);
        });
    } else {
      this.snackbar
        .showSnackbar('This is not an electron app.');
    }
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

  private get isElectron(): boolean {
    return this._electron.isElectronApp;
  }
}
