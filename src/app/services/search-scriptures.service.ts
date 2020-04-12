import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { ElectronService } from 'ngx-electron';

import { ISearchResults } from '../interfaces/i-search-results';

@Injectable({
  providedIn: 'root'
})
export class SearchScripturesService {
  private searchSubject: Subject<ISearchResults> = new Subject();

  constructor(
    private _electron?: ElectronService
  ) { }

  public listenResult(): void {
    this._electron.ipcRenderer
      .on(
        'search-result',
        (_, data: ISearchResults) => {
          this.searchSubject.next(data);
        });
  }

  public search(string: string): void {
    this._electron.ipcRenderer
      .send('search', {query: string});
  }

  public get subject(): Subject<ISearchResults> {
    return this.searchSubject;
  }
}
