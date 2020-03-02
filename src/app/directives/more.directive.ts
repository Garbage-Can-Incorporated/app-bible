import { Directive, HostListener } from '@angular/core';
import { DialogService } from '../services/dialog.service';

@Directive({
  selector: '[appMore]'
})
export class MoreDirective {

  constructor(
    private _dialog: DialogService
  ) { }

  @HostListener('click', [ '$event' ])
  onClick(e: Event): void {
    console.log({ e });
  }
}
