import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { ElectronService } from 'ngx-electron';

import { ISearchResults } from '../interfaces/i-search-results';
import {SnackbarService} from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class SearchScripturesService {
  private searchSubject: Subject<ISearchResults> = new Subject();

  constructor(
    private snackbar: SnackbarService,
    private _electron?: ElectronService
  ) { }

  public listenResult(): void {
    if (this._electron.isElectronApp) {
      this._electron.ipcRenderer
        .on(
          'search-result',
          (_, data: ISearchResults) => {
            this.searchSubject.next(data);
          });
    } else {
      this.showErrorSnackbar();
    }
  }

  public search(string: string): void {
    if (this._electron.isElectronApp) {
      this._electron.ipcRenderer
        .send('search', {query: string});
    } else {
      this.showErrorSnackbar();
    }
  }

  public get subject(): Subject<ISearchResults> {
    return this.searchSubject;
  }

  private showErrorSnackbar(): void {
    this.snackbar.showSnackbar('Not an Electron app');
  }
}
