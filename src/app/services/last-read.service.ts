import { Injectable } from '@angular/core';

import { IScriptures } from '../interfaces/i-scriptures';

@Injectable({
  providedIn: 'root'
})
export class LastReadService {

  constructor() { }

  public setLastRead(item: IScriptures): void {
    window.localStorage.setItem('lr', JSON.stringify(item));
  }

  public get lastRead(): IScriptures {
    return this.fetchFromLS;
  }

  private get fetchFromLS(): IScriptures {
    return (JSON.parse(window.localStorage.getItem('lr')));
  }
}
