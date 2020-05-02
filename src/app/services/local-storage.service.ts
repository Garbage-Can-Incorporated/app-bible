import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public add(doc: any, str: string = 'favs'): void {
    this.insert(doc, str);
  }

  public getItems(str: string = 'favs'): string {
    return this.retrieve(str);
  }

  public clearItem(str: string = 'favs'): void {
    window.localStorage.removeItem(str);
  }

  private insert(doc: any, str: string): void {
    return window.localStorage.setItem(str, JSON.stringify(doc));
  }

  private retrieve(str: string): string {
    return window.localStorage.getItem(str);
  }
}
