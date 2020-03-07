import { Directive, HostListener, Input } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { IScriptures } from '../interfaces/i-scriptures';

@Directive({
  selector: '[appDeleteFavorite]'
})
export class DeleteFavoriteDirective {
  @Input() public data: IScriptures;

  constructor(
    private _electron: ElectronService
  ) { }

  @HostListener('click', [ '$event' ])
  onClick(e: Event) {
    e.stopPropagation();
    this.removeItem(e.target);
  }

  private removeItem(el: any): void {
    this._electron.ipcRenderer
      .send(
        'remove-fav-item',
        {
          scripture: {
            book: this.data.book,
            chapter: this.data.chapter,
            verse: this.data.verse,
          }
        }
      );

    this._electron.ipcRenderer
      .on(
        'fav-item-removal-status',
        (e, data) => {
          console.log({ data });

          if (data.status) {
            el.parentNode.parentNode.remove();
          }
    });
  }
}
