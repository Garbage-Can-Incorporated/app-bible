import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { IScriptures } from '../interfaces/i-scriptures';

@Injectable({
  providedIn: 'root'
})
export class LastReadService {
  public lastReadSubject: Subject<IScriptures> = new Subject();

  constructor() { }

  public setLastRead(item: IScriptures): void {
    window.localStorage.setItem('lr', JSON.stringify(item));
    this.lastReadSubject.next(item);
  }

  public get lastRead(): IScriptures {
    return this.fetchFromLS;
  }

  private get fetchFromLS(): IScriptures {
    return (JSON.parse(window.localStorage.getItem('lr')));
  }
}
