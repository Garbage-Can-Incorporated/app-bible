import { Directive, ViewChild } from '@angular/core';

@Directive({
  selector: '[appFavorite]'
})
export class FavoriteDirective {
  @ViewChild('likeIcon', { static: false }) el: any;

  constructor() { }


  public likeVerse(): void {
    const el = this.el;
    console.log({el});

    if (el.classList.contains('far')) {
      el.classList.replace('far', 'fa');
      el.classList.add('__red--color');
      return;
    }

    if (el.classList.contains('fa')) {
      el.classList.replace('fa', 'far');
      el.classList.remove('__red--color');
      return;
    }
  }

}
