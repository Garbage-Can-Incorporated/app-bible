import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { distinct } from 'rxjs/operators';

import { ResourceHandlerService } from './resource-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ScripturesService {
  public wholeBook: Observable<any>;
  constructor(
    private _resources: ResourceHandlerService
  ) { }

  public getBookList(): Observable<any> {
    return new Observable((obs) => {
      this._resources.fetchResource()
      .subscribe(
        (data) => {
          data.request
            .forEach(
              (cur: any) => obs.next(cur.bookTitle)
            );
        },
        (error) => {
          obs.error(error);
        }
      );
    })
    .pipe(
      distinct()
    );
  }

  public getBible(): void {
    this._resources.fetchResource()
      .subscribe(
        (data) => {
          this.wholeBook = of(...data);
        },
        (error) => {
          console.log({error});
        }
      );
  }
}
