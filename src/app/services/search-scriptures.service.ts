import { Injectable } from '@angular/core';

import Fuse from 'fuse.js';
import { ScripturesService } from './scriptures.service';

@Injectable({
  providedIn: 'root'
})
export class SearchScripturesService {
  private options: any = {
    caseSensitive: true,
    shouldSort: true,
    tokenize: true,
    matchAllTokens: true,
    findAllMatches: true,
    includeScore: true,
    includeMatches: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 100,
    minMatchCharLength: 1,
    keys: ['verse']
  };

  public data: Array<any>;
  public fuse: any;

  constructor(
    private _scripture: ScripturesService
  ) {}

  public __init__(cb): void {
    this._scripture
      ._getBible(
        (data: Array<any>) => {
          this.data = data;
          this.fuse = new Fuse(this.data, this.options);
          cb();
        }
      );
  }

  public search(string: string): any {
    return this.fuse.search(string);
  }

  public changeOptions(): any {
    return this.options;
  }
}
