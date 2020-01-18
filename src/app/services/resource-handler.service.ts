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

  private getResource(): Observable<any> {
    return this.http.get(this.url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'body',
      responseType: 'json',
    });
  }

  public logResource(): void {
    this.getResource().subscribe(
      (data) => {
        console.log({ data });
      },
      (error) => {
        console.log({ error });
      }
    );
  }
}
