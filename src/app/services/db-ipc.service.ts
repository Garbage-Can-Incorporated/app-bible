import {Injectable} from '@angular/core';

import { Subject } from 'rxjs';

import { ElectronService } from 'ngx-electron';
import {SnackbarService} from './snackbar.service';
import { IpcMainResponse } from '../interfaces/ipc-main-response';

@Injectable({
  providedIn: 'root'
})
export class DbIpcService {
  private dbInitSubject: Subject<any>;
  private isConnectedSubject: Subject<any>;
  private dbInitStatusSubject: Subject<any>;
  private tableInitSubject: Subject<any>;

  constructor(
    private snackbar: SnackbarService,
    private _electron?: ElectronService
  ) {
    this.dbInitSubject = new Subject<any>();
    this.dbInitStatusSubject = new Subject<any>();
    this.tableInitSubject = new Subject<any>();
    this.isConnectedSubject = new Subject<any>();
  }

  public createDB(title: string): Subject<any> {
    if (this.isElectron) {
      this._electron.ipcRenderer.send('db-init', title);
    } else {
      this.snackbar
        .showSnackbar('This is not an electron app.');
    }

      return this.dbInitSubject;
    } else {
      this.snackbar
        .showSnackbar('This is not an electron app.');
    }
  }

  public isConnected(name: string): Subject<any> {
    if (this.isElectron) {
      this._electron.ipcRenderer
        .on(`${name}-db-table-created`, (e, data) => {
          this.isConnectedSubject.next(data);
        });
    } else {
      this.snackbar
        .showSnackbar('This is not an electron app.');
    }

      return this.isConnectedSubject;
    } else {
      this.snackbar
        .showSnackbar('This is not an electron app.');
    }
  }

  public isDBCreated(name: string): void {
    if (this.isElectron) {
      this._electron.ipcRenderer
        .send(`is-${name}-created`);
    } else {
      this.snackbar
        .showSnackbar('This is not an electron app.');
    }
  }

  public get subjects(): {[prop: string]: Subject<any>} {
    return {
      dbInitSubject: this.dbInitSubject,
      dbInitStatusSubject: this.dbInitStatusSubject,
      tableInitSubject: this.tableInitSubject,
      isConnectedSubject: this.isConnectedSubject
    };
  }

  private get isElectron(): boolean {
    return this._electron.isElectronApp;
  }
}
