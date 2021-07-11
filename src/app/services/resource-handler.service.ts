import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

export interface BibleElement {
  version: string,
  verses: Array<any>,
  bookTitle: string,
  chapterNo: string
};

@Injectable({
  providedIn: 'root'
})
export class ResourceHandlerService {
  private url = './assets/resource';
  private resource: Subject<Array<BibleElement>> = new Subject();

  constructor(
    private http: HttpClient
  ) { }

  public get getURL(): string {
    let version;
    return `${this.url}/bible-${version || 'kjv'}.json`;
  }

  public fetchResource(): Observable<{request: Array<BibleElement>}> {
    return this.http.get<{request: Array<BibleElement>}>(this.getURL, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'body',
      responseType: 'json',
    });
  }
}
