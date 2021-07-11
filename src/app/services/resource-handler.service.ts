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
  private url = './assets/resource/bible-kjv.json';
  private resource: Subject<Array<BibleElement>> = new Subject();

  constructor(
    private http: HttpClient
  ) { }

  public fetchResource(): Observable<{request: Array<BibleElement>}> {
    return this.http.get<{request: Array<BibleElement>}>(this.url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'body',
      responseType: 'json',
    });
  }
}
