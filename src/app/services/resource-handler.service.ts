import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceHandlerService {
  private url = './assets/resource/bible-all.json';

  constructor(
    private http: HttpClient
  ) { }

  public fetchResource(): Observable<any> {
    return this.http.get<any>(this.url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'body',
      responseType: 'json',
    });
  }
}
