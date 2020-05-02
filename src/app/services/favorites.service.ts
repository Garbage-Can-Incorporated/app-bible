import { Injectable } from '@angular/core';

import { IScriptures } from '../interfaces/i-scriptures';

import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  constructor(
    private lc: LocalStorageService
  ) { }

  public removeFavorite(_item: IScriptures): void {
    const items: Array<IScriptures> | Array<any> = this.getFavorites();

    const filteredEl: Array<IScriptures> | Array<any> = items
      .filter((item: IScriptures) => item.book !== _item.book &&
          item.chapter !== _item.chapter &&
          item.book !== _item.book
      );

    this.lc.add(filteredEl);
  }

  public addToFavorites(item: IScriptures) {
    const items = this.getFavorites();
    items.push(item);
    this.lc.add(items, 'favs');
  }

  public getFavorites(): Array<IScriptures> | Array<any> {
    const items: Array<IScriptures> | Array<any> = JSON.parse(this.lc.getItems('favs'));
    return items !== null ? items : [];
  }
}
