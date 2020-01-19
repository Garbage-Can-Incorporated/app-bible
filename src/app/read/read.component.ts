import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { IScriptures } from '../interfaces/i-scriptures';

import { ScripturesService } from '../services/scriptures.service';
@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {
  private _scripture: IScriptures =  {
    book: 'genesis',
    chapter: 1,
    verse: 1
  };
  public scripture: IScriptures = { ...this._scripture };
  public bookList: Array<string> = [];
  public playerState = <boolean>false;
  public chapterList: number[] = [];
  public verseList: number[] = [];
  public passages: Array<any>;
  public focusElementNo: number;

  constructor(
    private _scripturesProvider: ScripturesService
  ) { }

  ngOnInit() {
    this.populateBookList();

    this.populateChapterList();
    this.populateVerseList();
    this.searchScripture();
  }

  public searchScripture(): void {
    const {book, verse, chapter} = this.scripture;
    if (book !== '' && chapter !== undefined) {
      this.focusElementNo = typeof verse === 'string' ? parseInt(verse, 10) : verse;
      this.getPassage(book, chapter);
    }
  }

  private getPassage(b: string, c: number): void {
    this._scripturesProvider
      .getPassage(b, c)
      .subscribe(
        (data) => {
          this.passages = data;
        },
        (error) => console.log({error})
      );
  }

  /* public testFn(e): void {
    console.log({s: this.scripture}, 'mouseleave');
  } */

  private populateVerseList(): void {
    this._scripturesProvider
    .getVerseLength()
    .subscribe(
      (data) => {
        this.verseList = this.generateListNumbers(data);
      }
    );
  }

  private populateChapterList(): void {
    this._scripturesProvider
    .getChapterLength()
    .subscribe(
      (data: number) => {
        this.chapterList = this.generateListNumbers(data);
      }
    );
  }

  private generateListNumbers(data: any): number[] {
    const res: number[] = Array.from({ length: data + 1}, (_, i) => i);
    res.shift();
    return res;
  }

  private populateBookList(): void {
    this._scripturesProvider
      .getBookList()
      .subscribe(
        (data) => {
          this.bookList.push(data.toString()/* .charAt(0).toUpperCase() */);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  public typeaheadOnSelect(e: any, key: string): void {
    if (key === 'b') {
      this.scripture.book = e.value;
    }

    if (key === 'c') {
      this.scripture.chapter = typeof e.value === 'string' ? parseInt(e.value, 10) : e.value;
    }

    if (key === 'v') {
      this.scripture.verse = typeof e.value === 'string' ? parseInt(e.value, 10) : e.value;
    }

    this.searchScripture();
  }

  public showReactionConsole(el: any): void {
    const children: HTMLCollection[] = el.children;

    for (let i = 0; i < children.length; i++) {
      el.children[i].classList.remove('d-none');
    }
  }

  public hideReactionConsole(el: any): void {
    const children: HTMLCollection[] = el.children;

    for (let i = 0; i < children.length; i++) {
      el.children[i].classList.add('d-none');
    }
  }

  public togglePlayerState(): void {
    this.playerState = !this.playerState;
  }
}
