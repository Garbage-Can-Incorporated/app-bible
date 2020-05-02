import { Directive, HostListener, OnInit, Input, ElementRef, OnChanges } from '@angular/core';

import { SnackbarService } from '../services/snackbar.service';

import { IScriptures } from '../interfaces/i-scriptures';

@Directive({
  selector: '[appFavorite]'
})
export class FavoriteDirective implements OnInit, OnChanges {
  @Input() scripture: IScriptures;
  @Input() toggleIcon: boolean;

  constructor(
    private _snackbar: SnackbarService,
    private el: ElementRef
  ) { }

  ngOnInit() { }

  ngOnChanges() {
    if (this.toggleIcon) {
      this.addFavIcon(this.el.nativeElement);
    } else {
      this.removeFavIcon(this.el.nativeElement);
    }
  }

  @HostListener('click', [ '$event' ])
  onClick(e: Event): void {
    if (this.toggleIcon) {
      // remove from fav local storage
      this.removeFavVerse(e.target);
    } else {
      this.addToFavVerse(e.target);
    }
  }

  private removeFavVerse(e: EventTarget): void {

  }

  private addToFavVerse(e: EventTarget): void {

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
}
