import { Component, OnInit, Input, OnChanges, SimpleChanges, HostListener } from '@angular/core';

import { ElectronService } from 'ngx-electron';

import { IScriptures } from '../interfaces/i-scriptures';
import { IpcMainResponse } from '../interfaces/ipc-main-response';

@Component({
  selector: 'app-scripture-item',
  templateUrl: './scripture-item.component.html',
  styleUrls: ['./scripture-item.component.css']
})
export class ScriptureItemComponent implements OnInit, OnChanges {
  @Input() public passage: string;
  @Input() public i: number;
  @Input() focusElementNo: number;
  @Input() resource: IScriptures;
  public favIconActive: boolean;

  constructor(
    private _electron: ElectronService
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void { }

  @HostListener('mouseenter', [ '$event' ])
  onMouseover(e: Event): void {
    this.isFavorite();
  }

  private isFavorite(): void {
    if (this._electron.isElectronApp) {
      this._electron.ipcRenderer.send('is-fav-check', this.resource);
      this._electron.ipcRenderer.on(
        'is-fav-checked',
        (e: Event, data: IpcMainResponse) => {
          console.log(e, data);

          if (data.status) {
            this.favIconActive = true;
          } else {
            this.favIconActive = false;
          }
        }
      );

      return;
    }

    console.log(`Not an Electron Env`);
  }

  public showReactionConsole(el: any): void {
    el.toggleIconsVisibility();
  }

  public hideReactionConsole(el: any): void {
    el.toggleIconsVisibility();
  }
}
