import { Component, OnInit, OnDestroy, OnChanges, Renderer2 } from '@angular/core';

import { Observable } from 'rxjs';

import { DbIpcService } from '../services/db-ipc.service';
import { ElectronService } from 'ngx-electron';
import { ScripturesService } from '../services/scriptures.service';

import { IScriptures } from '../interfaces/i-scriptures';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnChanges, OnDestroy {
  public items: Array<string> = [];
  public dbResult: Array<any> = [];
  private dbStatus: any;
  private tbStatus: any;

  constructor(
    private _dbIPC: DbIpcService,
    private _scriptureService: ScripturesService,
    private renderer: Renderer2,
    private _electron?: ElectronService
  ) { }

  ngOnInit() {
    this._dbIPC
      .isDBCreated('favorites');
    this.checkStatus();
    this.retrieveFavList();
  }

  ngOnChanges() {
    /* if (this._electron.isElectronApp) {
      this._dbIPC
        .isConnected('favorites')
        .subscribe(
          (data: { dbInit: boolean, tableInit: boolean }) => {
            this.dbStatus = data.dbInit;
            this.tbStatus = data.tableInit;
          }
      );

      this.retrieveFavList();
    } */
  }

  ngOnDestroy() {
    // this._dbIPC.subjects.isConnectedSubject.unsubscribe();
  }

  private retrieveFavList(): void {
    if (this._electron.isElectronApp) {
      this._electron.ipcRenderer.send('list-fav-items');

      this._electron.ipcRenderer
        .on(
          'favorite-items-listed',
          (e, data: Array<IScriptures>) => {
            this.dbResult = data;

            data
              .forEach((cur: IScriptures) => {
                this
                  .getPassage(cur.book, cur.chapter)
                  .subscribe(
                    (_data) => {
                      this.items.push(_data[cur.verse]);
                    },
                    (error) => console.log({ error }),
                    () => console.log('complete!')
                  );
              });
          });
    }
  }

  private getPassage(book: string, chapter: number): Observable<any> {
    return this._scriptureService.getPassage(book, chapter);
  }

  private checkStatus(): void {
    this._dbIPC.isConnected('favorites')
    .subscribe(
      (data) => {
        this.dbStatus = data.dbInit;
        this.tbStatus = data.tableInit;
      },
      (error) => console.log(`[Error] db connection error`, {error})
    );
  }
}
