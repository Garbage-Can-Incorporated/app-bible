import {Directive, HostListener, NgZone} from '@angular/core';

import {DialogService} from '../services/dialog.service';

import { MoreComponent } from '../more/more.component';

@Directive({
  selector: '[appMore]'
})
export class MoreDirective {

  constructor(
    private _dialog: DialogService,
    private zone: NgZone
  ) { }

  @HostListener('click', [ '$event' ])
  onClick(e: Event): void {
    this.zone.run((): void => {
      this._dialog
      .openDialog(
        {},
        MoreComponent,
        {
          minHeight: null, maxHeight: null,
          maxWidth: '80%', width: '80%'
        }
      );
    });
  }
}
