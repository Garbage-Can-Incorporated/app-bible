import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { distinct } from 'rxjs/operators';

import { BibleElement, ResourceHandlerService } from './resource-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ScripturesService {
  private resource: Array<BibleElement>;
  private semiIndex: {[key in string]: Array<BibleElement>} = {};

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
  }

  public getVerseLength(bookTitle: string = 'genesis', chapNo: number = 1): Observable<number> {
    return new Observable((obs) => {
      this.getBible((book: any): void => {
        const chapter = this.semiIndex[bookTitle].find((cur) => cur.chapterNo === `chapter-${ chapNo }`);

        if (chapter !== undefined) {
          obs.next(chapter.verses.length);
        }
      });
    });
  }

  public getChapterLength(bookTitle: string = 'genesis'): Observable<number> {
    return new Observable((obs) => {
      this.getBible((): void => {
        const len = this.semiIndex[bookTitle].length;
        obs.next(len || 0);
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

  private getBible(cb: (data?: Array<BibleElement>) => any): void {
    if (this.resource !== undefined) {
      cb(this.resource);
    } else {
      this._resources.fetchResource()
        .subscribe(
          (data: Array<BibleElement>) => {
            this.resource = data;
            this.semiIndexList();
            cb(data);
          },
          (error) => {
            console.log({ error });
            cb(error);
          }
        );
    }
  }

  private semiIndexList(): void {
    let knownKeys: Array<string>;

    if (knownKeys === undefined) {
      // take first element's key as model, keys are circular, same for all elements
      knownKeys = Object.keys(this.resource[0]);
    }

    knownKeys.forEach((key) => {
      if (key.toLowerCase() !== 'verses' && key.toLowerCase() !== 'version') {
        this.resource.forEach((resource) => {
          if (this.semiIndex[resource[key]] === undefined) {
            this.semiIndex[resource[key]] = [];
          }

          if (this.semiIndex[resource[key]].length === 0) {
            this.semiIndex[resource[key]] = this.resource
              .map(r => {
                if (resource[key] === r[key]) {
                  return r;
                }
              }).filter((e) => e !== undefined);
          }
        });
      }
    });

    // console.log(this.semiIndex);
  }

  public resetResource(): void {
    this.resource = undefined;
  }

  public get _getBible(): Observable<any> {
    return this._resources.fetchResource();
  }
}
