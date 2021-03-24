import { Component, OnInit, Input, OnChanges, SimpleChanges, HostListener, ChangeDetectorRef } from '@angular/core';

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

  public textToRemove: string;

  constructor(
    private _electron: ElectronService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.textToRemove = `${this.resource.book} ${this.resource.chapter}:${this.resource.verse + 1}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.textToRemove = `${this.resource.book} ${this.resource.chapter}:${this.resource.verse}`;
    this.detectChange();
  }

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
          if (data.status) {
            this.favIconActive = true;
          } else {
            this.favIconActive = false;
          }

          this.detectChange();
        }
      );

      return;
    }

    console.log(`Not an Electron Env`);
  }

  public showReactionConsole(el: any): void {
    el.toggleIconsVisibility();
    this.detectChange();
  }

  public hideReactionConsole(el: any): void {
    el.toggleIconsVisibility();
    this.detectChange();
  }

  public detectChange(): void {
    this.changeDetector.detach();
    this.changeDetector.reattach();
    this.changeDetector.detectChanges();
  }
}
