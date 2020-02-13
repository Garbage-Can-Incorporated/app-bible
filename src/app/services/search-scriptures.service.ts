import { Injectable } from '@angular/core';

import Fuse from 'fuse.js';
import { ScripturesService } from './scriptures.service';
import { Observable } from 'rxjs';
import { ISearchResults } from '../interfaces/i-search-results';

@Injectable({
  providedIn: 'root'
})
export class SearchScripturesService {
  private options: any = {
    caseSensitive: false,
    shouldSort: true,
    tokenize: true,
    matchAllTokens: true,
    findAllMatches: true,
    includeScore: true,
    includeMatches: true,
    threshold: 0.0,
    // location: 0,
    // distance: 100,
    maxPatternLength: 100,
    minMatchCharLength: 5,
    keys: ['verses']
  };

  public data: Array<any>;
  public fuse: any;

  constructor(
    private _scripture: ScripturesService
  ) {
    this.__init__();
  }

  public __init__(): void {
    console.log('__init__');

    this._scripture
      ._getBible.subscribe(
        (data: any) => {
          this.data = data.request;

          this.fuse = new Fuse(this.data, this.options);
        },
        (error) => console.log({error})
      );
  }

  public search(string: string): Observable<ISearchResults> {
    // console.log(this.data);
    return this.fuse.search(<string>string);
  }

  public changeOptions(): any {
    return this.options;
  }
}
