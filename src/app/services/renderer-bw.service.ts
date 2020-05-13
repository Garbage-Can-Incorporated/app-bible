import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { TwitterShare } from '../interfaces/share';

@Injectable({
  providedIn: 'root'
})
export class RendererBwService {
  private bw: Electron.BrowserWindow;

  constructor(
    private _electron?: ElectronService
  ) { }

  public createWindow(
    url: string,
    data: TwitterShare,
    windowConfig: Electron.BrowserWindowConstructorOptions = {
      center: true,
      width: 575,
      movable: true,
      modal: true,
      autoHideMenuBar: true,
    }
  ): Promise<void> {
    this.bw = new this._electron.remote.BrowserWindow(windowConfig);

    return this.bw
      .loadURL(
        url
          .concat(`text=${ data.text }`)
          .concat(`&via=${ data.via }`)
          .concat(`&hashtags=${data.hashtags}`)
      );
  }
}
