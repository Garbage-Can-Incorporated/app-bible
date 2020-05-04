import {
  Directive, HostListener, OnInit, Input, ElementRef, OnChanges,
  DoCheck,
} from '@angular/core';

import { IScriptures } from '../interfaces/i-scriptures';

import { SnackbarService } from '../services/snackbar.service';
import { FavoritesService } from '../services/favorites.service';

@Directive({
  selector: '[appFavorite]'
})
export class FavoriteDirective implements OnInit, OnChanges, DoCheck {
  @Input() scripture: IScriptures;
  private toggleIcon: boolean;

  constructor(
    private _snackbar: SnackbarService,
    private el: ElementRef,
    private _favorites: FavoritesService
  ) { }

  ngOnInit() { }

  ngDoCheck() {
    const exists = this._favorites.exists(this.scripture);
    this.toggleIcon = exists;
    this.setFavIcon();
  }

  private setFavIcon(): void {
    if (this.toggleIcon) {
      // add heart color
      this.addFavIcon(this.el.nativeElement);
    } else {
      // remove heart color
      this.removeFavIcon(this.el.nativeElement);
    }
  }

  ngOnChanges() { }

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
    this._favorites.removeFavorite(this.scripture);
    this._snackbar.showSnackbar('Favorite removed...');
  }

  private addToFavVerse(e: EventTarget): void {
    const exists: boolean = this._favorites.exists(this.scripture);

    if (exists) {
      return;
    }

    this._favorites.addToFavorites(this.scripture);
    this._snackbar.showSnackbar('Favorite added...');
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
