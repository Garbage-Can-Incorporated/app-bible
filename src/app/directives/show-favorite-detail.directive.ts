import { Directive, HostListener, Input } from '@angular/core';

import { DialogService } from '../services/dialog.service';

import { FavoriteDetailComponent } from '../favorite-detail/favorite-detail.component';

@Directive({
  selector: '[appShowFavoriteDetail]'
})
export class ShowFavoriteDetailDirective {
  @Input() public data: string;

  constructor(
    private _dialog: DialogService
  ) { }

  @HostListener('click')
  onClick(): void {
    // open dialog
    this._dialog.openDialog(
      {data: this.data},
      FavoriteDetailComponent,
      {height: 'fit-content', width: 'fit-content'}
    );
  }
}
