import { Directive, HostListener, OnInit, Input } from '@angular/core';

import { ElectronService } from 'ngx-electron';
import { IScriptures } from '../interfaces/i-scriptures';

import { SnackbarService } from '../services/snackbar.service';

@Directive({
  selector: '[appFavorite]'
})
export class FavoriteDirective implements OnInit {
  @Input() scripture: IScriptures;
  private dbStatus: boolean;
  private tableStatus: boolean;

  constructor(
    private _electron: ElectronService,
    private _snackbar: SnackbarService
  ) { }

  ngOnInit() {
    if (this.isElectronApp) {
      this._electron.ipcRenderer.send('db-init', 'favorites');

      this.setDBStatus();
      this.getTableStatus();

      return;
    }
  }

  @HostListener('click', [ '$event' ])
  onClick(e: Event): void {
    this.addToFavVerses(e.target);
  }

  public addToFavVerses(e: EventTarget): void {
    if (this.isElectronApp && this.dbStatus && this.tableStatus) {
      this._electron.ipcRenderer.send(
        'add-fav-item',
        { scripture: this.scripture }
      );

      this.waitFavAdditionStatus(e);

      return;
    }
  }

  private waitFavAdditionStatus(evt: EventTarget): void {
    this._electron.ipcRenderer.on(
      'fav-item-addition-status',
      (e, data: { status: boolean, err?: any, message: string }) => {
        console.log('[DB] verse added to favorites', { e, data });

        if (data.status) {
          this.addFavIcon(evt);
        } else {
          this.removeFavIcon(evt);
        }

        this._snackbar
          .showSnackbar(data.message);
      }
    );
  }


  private getTableStatus(): void {
    this._electron.ipcRenderer.on(
      'db-table-creation-status',
      (e: Event, data: { status: boolean, error?: any }) => {
        console.log('[DB] get Table creation status', { e, data });
          this.tableStatus = data.status;
      }
    );
  }

  private setDBStatus(): void {
    this._electron.ipcRenderer.on(
      'db-init-status',
      (e: Event, data: { status: boolean, error?: any }) => {
        console.log('[DB] get DB init status', { e, data });

        this.dbStatus = data.status;
      }
    );
  }

  private addFavIcon(el: any): void {
    if (el.classList.contains('far')) {
      el.classList.replace('far', 'fa');
      el.classList.add('__red--color');
      return;
    }
  }

  private removeFavIcon(el: any): void {
    if (el.classList.contains('fa')) {
      el.classList.replace('fa', 'far');
      el.classList.remove('__red--color');
      return;
    }
  }

  private get isElectronApp(): boolean {
    return this._electron.isElectronApp;
  }
}
