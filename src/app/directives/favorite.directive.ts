import { Directive, HostListener, OnInit, Input } from '@angular/core';

import { ElectronService } from 'ngx-electron';

import { IScriptures } from '../interfaces/i-scriptures';

@Directive({
  selector: '[appFavorite]'
})
export class FavoriteDirective implements OnInit {
  @Input() scripture: IScriptures;
  private dbStatus: boolean;
  private tableStatus: boolean;

  constructor(
    private _electron: ElectronService
  ) { }

  ngOnInit() {
    console.log({ isElectron: this.isElectronApp });
    if (this.isElectronApp) {
      console.log(`[message] sending to main process`);
      this._electron.ipcRenderer.send('db-init', 'favorites');

      this.setDBStatus();
      this.getTableStatus();

      return;
    }

    console.log(`[message] not sent to main process`);
  }

  @HostListener('click', [ '$event' ])
  onClick(e: Event): void {
    console.log({ s: this.scripture });
    this.addToFavVerses();
    this.toggleFavIcon(e.target);
  }

  public addToFavVerses(): void {
    if (this.isElectronApp && this.dbStatus && this.tableStatus) {
      this._electron.ipcRenderer.send(
        'add-fav-item',
        { scripture: this.scripture }
      );
      return;
    }

    // show snackbar
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

  private toggleFavIcon(el: any): void {
    if (el.classList.contains('far')) {
      el.classList.replace('far', 'fa');
      el.classList.add('__red--color');
      return;
    }

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
