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
  public chapterList: string[] = [];
  public verseList: string[] = [];

  constructor(
    private _scripturesProvider: ScripturesService
  ) { }

  ngOnInit() {
    this.populateBookList();

    this.populateChapterList();
    this.populateVerseList();
  }

  public searchScripture(): void {
    const {book} = this.scripture;
  }

  private populateVerseList(): void {
    this._scripturesProvider
    .getVerseLength()
    .subscribe(
      (data) => {
        console.log({data});
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

  private generateListNumbers(data: any): void {
    const res: string[] = Array.from({ length: data + 1}, (_, i) => i);
    res.shift();
    console.log({res});
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
