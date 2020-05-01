import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { distinct, map } from 'rxjs/operators';

import { ResourceHandlerService } from './resource-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ScripturesService {
  private resource: any;

  constructor(
    private _resources: ResourceHandlerService
  ) { }

  public getPassage(b: string, c: number): Observable<any> {
    return new Observable((obs) => {
      this.getBible((book: any): void => {
        obs.next(
          book
            .find((cur: any) => {
              return (
                cur.bookTitle === b.toLowerCase() &&
                cur.chapterNo === `chapter-${ c }`
              );
            })
            .verses
        );
      });
    });
      // .pipe(
      //     map((v: Array<any>) => v.map((vv) => vv.split(' ').slice(2).join(' ')))
      //   );
  }

  public getVerseLength(bookTitle: string = 'genesis', chapNo: number = 1): Observable<number> {
    return new Observable((obs) => {
      this.getBible((book: any): void => {
        obs.next(
          book
            .find((cur: any) => {
              return (
                cur.bookTitle === bookTitle.toLowerCase() &&
                cur.chapterNo === `chapter-${chapNo}`
                );
            })
            .verses
            // .filter((cur: any) => cur !== undefined)
            .length
        );
      });
    });
  }

  public getChapterLength(bookTitle: string = 'genesis'): Observable<number> {
    return new Observable((obs) => {
      this.getBible((book: any): void => {
        obs.next(book
          .filter((cur: any) => {
            if (cur.bookTitle === bookTitle.toLowerCase()) {
              return cur.chapterNo;
            }
          })
          .filter((cur: any) => cur !== undefined)
          .length
        );
      });
    });
  }

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

  private getBible(cb: any): void {
    if (this.resource !== undefined) {
      cb(this.resource);
      return;
    }

    this._resources.fetchResource()
      .subscribe(
        (data) => {
          this.resource = data.request;
          cb(data.request);
        },
        (error) => {
          console.error({error});
          cb(error);
        }
      );
  }

  public get _getBible(): Observable<any> {
    return this._resources.fetchResource();
  }
}
