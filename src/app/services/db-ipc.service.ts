import { Injectable } from '@angular/core';

import { ElectronService } from 'ngx-electron';
import { Subject } from 'rxjs';
import { IpcMainResponse } from '../interfaces/ipc-main-response';
import { Dpi } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class DbIpcService {
  private dbInitSubject: Subject<any>;
  private isConnectedSubject: Subject<any>;
  private dbInitStatusSubject: Subject<any>;
  private tableInitSubject: Subject<any>;

  constructor(
    private _electron: ElectronService
  ) {
    this.dbInitSubject = new Subject<any>();
    this.dbInitStatusSubject = new Subject<any>();
    this.tableInitSubject = new Subject<any>();
    this.isConnectedSubject = new Subject<any>();
  }

  public createDB(title: string): Subject<any> {
    this._electron.ipcRenderer.send('db-init', title);

    return this.dbInitSubject;
  }

  public getDBStatus(): Subject<any> {
    this._electron.ipcRenderer.on(
      'db-init-status',
      (e: Event, data: IpcMainResponse) => {
        this.dbInitStatusSubject.next(data);
      }
    );

    return this.dbInitStatusSubject;
  }

  public getTableStatus(): Subject<any> {
    this._electron.ipcRenderer.on(
      'db-table-creation-status',
      (e: Event, data: IpcMainResponse) => {
        this.tableInitSubject.next(data);
      }
    );

    return this.tableInitSubject;
  }

  public isConnected(): Subject<any> {
    this._electron.ipcRenderer
      .on('db-table-created', (e, data) => {
        this.isConnectedSubject.next(data);
      });

    return this.isConnectedSubject;
  }

  public isDBCreated(): void {
    this._electron.ipcRenderer
      .send('is-created');
  }

  public get subjects(): {[prop: string]: Subject<any>} {
    return {
      dbInitSubject: this.dbInitSubject,
      dbInitStatusSubject: this.dbInitStatusSubject,
      tableInitSubject: this.tableInitSubject,
      isConnectedSubject: this.isConnectedSubject
    };
  }
}
