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

  public getPassage(bookTitle: string = 'genesis', chapNo: number = 1): Observable<any> {
    return new Observable((obs) => {
      this.getBible((): void => {
        const chapter = this.semiIndex[`${bookTitle}-chapter-${ chapNo }`];

        if (chapter && chapter[0] !== undefined) {
          obs.next(chapter[0].verses);
        }
      });
    });
  }

  public getVerseLength(bookTitle: string = 'genesis', chapNo: number = 1): Observable<number> {
    return new Observable((obs) => {
      this.getBible((): void => {
        const chapter = this.semiIndex[`${bookTitle}-chapter-${ chapNo }`];

        if (chapter && chapter[0] !== undefined) {
          obs.next(chapter[0].verses.length);
        }
      });
    });
  }

  public getChapterLength(bookTitle: string = 'genesis'): Observable<number> {
    return new Observable((obs) => {
      this.getBible((): void => {
        const resource = this.semiIndex[bookTitle.toLowerCase()];

        if (resource !== undefined) {
          const len = this.semiIndex[bookTitle.toLowerCase()].length;
          obs.next(len);
        }
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
        // tslint:disable-next-line: deprecation
        .subscribe(
          (data: Array<BibleElement>) => {
            this.resource = data;
            this.semiIndexList();
            cb(data);
          },
          (error) => {
            console.error({ error });
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

    knownKeys.filter(key => (key !== 'verses' || (key as string) !== 'version'))
      .forEach((key) => {
        this.resource.forEach((resource) => {
          const indexKey = key === 'bookTitle' ? resource[key] : `${resource.bookTitle}-${resource[key]}`;

          if (this.semiIndex[indexKey] === undefined) {
            this.semiIndex[indexKey] = [];
          }

          if (this.semiIndex[indexKey].length === 0) {
            if (key === 'bookTitle') {
              this.semiIndex[indexKey] = this.resource
              .map(r => {
                if (indexKey === r[key]) {
                  return r;
                }
              }).filter((e) => e !== undefined);
            } else {
              this.semiIndex[indexKey] = this.resource
                .map(r => {
                  if (resource[key] === r[key] && resource.bookTitle === r.bookTitle) {
                    return r;
                  }
                }).filter((e) => e !== undefined);
            }
          }
        });
      });
  }

  public resetResource(): void {
    this.resource = undefined;
  }

  public get _getBible(): Observable<any> {
    return this._resources.fetchResource();
  }
}
