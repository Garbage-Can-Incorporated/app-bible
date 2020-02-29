import { Directive, HostListener, OnInit, Input, ElementRef, OnChanges } from '@angular/core';

import { ElectronService } from 'ngx-electron';
import { SnackbarService } from '../services/snackbar.service';
import { DbIpcService } from '../services/db-ipc.service';

import { IScriptures } from '../interfaces/i-scriptures';
import { IpcMainResponse } from '../interfaces/ipc-main-response';

@Directive({
  selector: '[appFavorite]'
})
export class FavoriteDirective implements OnInit, OnChanges {
  @Input() scripture: IScriptures;
  @Input() toggleIcon: boolean;
  private dbStatus: boolean;
  private tableStatus: boolean;

  constructor(
    private _electron: ElectronService,
    private _snackbar: SnackbarService,
    private el: ElementRef,
    private _dbIPC: DbIpcService
  ) { }

  ngOnInit() {
    console.log('[init] favorite directive');

    if (this.isElectronApp) {
      this._dbIPC.createDB('favorites');
      this._dbIPC
        .isDBCreated();

      this.setDBStatus();
      this.getTableStatus();

      return;
    }
  }

  ngOnChanges() {
    if (this.toggleIcon) {
      this.addFavIcon(this.el.nativeElement);
    } else {
      this.removeFavIcon(this.el.nativeElement);
    }

    if (this.isElectronApp) {
      this._dbIPC
        .isConnected()
        .subscribe(
          (data: {dbInit: boolean, tableInit: boolean}) => {
            this.dbStatus = data.dbInit;
            this.tableStatus = data.tableInit;
          }
        );
    }
  }

  @HostListener('click', [ '$event' ])
  onClick(e: Event): void {
    console.log({ t: this.toggleIcon, dbStatus: this.dbStatus, tableStatus: this.tableStatus });
    if (this.toggleIcon) {
      // remove from fav db
      console.log('unlike');
      this.removeFavVerse(e.target);
    } else {
      this.addToFavVerse(e.target);
    }
  }

  private removeFavVerse(e: EventTarget): void {
    if (this.isElectronApp && this.dbStatus && this.tableStatus) {
      this._electron.ipcRenderer.send(
        'remove-fav-item',
        { scripture: this.scripture }
      );

      this.waitFavRemovalStatus(e);

      return;
    }
  }

  private waitFavRemovalStatus(evt: EventTarget): void {
    this._electron.ipcRenderer.on(
      'fav-item-removal-status',
      (e, data: IpcMainResponse) => {
        if (data.status) {
          this.addFavIcon(evt);
        } else {
          this.removeFavIcon(evt);
        }

        // remove snackbar
        this._snackbar
          .showSnackbar(data.message);
      }
    );
  }

  private addToFavVerse(e: EventTarget): void {
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
      (e, data: IpcMainResponse) => {
        if (data.status) {
          this.addFavIcon(evt);
        } else {
          this.removeFavIcon(evt);
        }

        // remove snackbar
        this._snackbar
          .showSnackbar(data.message);
      }
    );
  }


  private getTableStatus(): void {
    this._dbIPC
      .getTableStatus()
      .asObservable()
      .subscribe(
        (data) => this.dbStatus = data.status,
        (error) => console.log(`[Error] DB init failed: ${ error }`)
      );
  }

  private setDBStatus(): void {
    this._dbIPC
      .getDBStatus()
      .asObservable()
      .subscribe(
        (data) => this.dbStatus = data.status,
        (error) => console.log(`[Error] DB init failed: ${error}`)
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
