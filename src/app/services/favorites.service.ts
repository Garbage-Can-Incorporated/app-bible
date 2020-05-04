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

  public exists(item: IScriptures): boolean {
    const exists = this.getFavorites().find((_item) => {
      return (
        _item.book === item.book &&
        _item.chapter === item.chapter &&
        _item.verse === item.verse
      );
    });

    return exists !== undefined ? true : false;
  }

  public removeFavorite(_item: IScriptures): void {
    const items: Array<IScriptures> | [] = this.getFavorites();

    const itemIndex: number = items.findIndex((cur) => {
      return cur.book === _item.book &&
        cur.chapter === _item.chapter &&
        cur.verse === _item.verse;
    });

    // remove 1 element from itemIndex, i.e remove only element at itemIndex
    items.splice(itemIndex, 1);

    this.lc.add(items);
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
