import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlarmIpcService {
  private allAlarmsSubject: Subject<any> = new Subject();
  private addAlarmSubject: Subject<any> = new Subject();

  constructor(
    private _electron?: ElectronService,
  ) { }

  public submitAlarm(alarm: any): void {
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
      'addAlarmSubject': this.addAlarmSubject,
      'allAlarmsSubject': this.allAlarmsSubject,
    };
  }
}
