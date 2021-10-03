import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export interface BibleElement {
  version: string;
  verses: Array<any>;
  bookTitle: string;
  chapterNo: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResourceHandlerService {
  private url = 'https://api.evryword.com.ng/v1/api';
  // private url = 'http://localhost:4445/v1/api';
  private resource: Subject<Array<BibleElement>> = new Subject();

  constructor(
    private http: HttpClient
  ) { }

  public getVersions(): Observable<{data: string[]}> {
    return this.http.get<{data: string[]}>(`${this.url}/versions`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'body',
      responseType: 'json',
    });
  }

  public get getURL(): string {
    return `${this.url}/all`;
  }

  public fetchResource(): Observable<{request: Array<BibleElement>}> {
    return this.http.get<{request: Array<BibleElement>}>(this.getURL, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params: {vrsn: window.localStorage.getItem('sv') || 'kjv'},
      observe: 'body',
      responseType: 'json',
    }).pipe(shareReplay(1));
  }
}
