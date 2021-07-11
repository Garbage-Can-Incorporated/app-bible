import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { distinct } from 'rxjs/operators';

import { BibleElement, ResourceHandlerService } from './resource-handler.service';

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
        const passage = book
          .find((cur: any) => {
            return (
              cur.bookTitle === b.toLowerCase() &&
              cur.chapterNo === `chapter-${ c }`
            );
          });

        if (passage !== undefined) {
          obs.next(passage.verses);
        }
      });
    });
      // .pipe(
      //     map((v: Array<any>) => v.map((vv) => vv.split(' ').slice(2).join(' ')))
      //   );
  }

  public getVerseLength(bookTitle: string = 'genesis', chapNo: number = 1): Observable<number> {
    return new Observable((obs) => {
      this.getBible((book: any): void => {
        const passage = book
          .find((cur: any) => {
            return (
              cur.bookTitle === bookTitle.toLowerCase() &&
              cur.chapterNo === `chapter-${ chapNo }`
            );
          });

        if (passage !== undefined) {
          obs.next(
            passage.verses.length
            // .filter((cur: any) => cur !== undefined)
          );
        }
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
      this.getBible((data: any) => {
        data
          .forEach(
            (cur: any) => obs.next(cur.bookTitle)
          );
      });
    })
    .pipe(
      distinct()
    );
  }

  private getBible(cb: (data: Array<BibleElement>) => void): void {
    if (this.resource !== undefined) {
      cb(this.resource);
    } else {
      this._resources.fetchResource()
        .subscribe(
          (data) => {
            this.resource = data.request;
            cb(data.request);
          },
          (error) => {
            console.log({ error });
            cb(error);
          }
        );
    }
  }

  public get _getBible(): Observable<{request: Array<BibleElement>}> {
    return this._resources.fetchResource();
  }
}
