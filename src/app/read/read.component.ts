import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';

import { IScriptures } from '../interfaces/i-scriptures';

import { ScripturesService } from '../services/scriptures.service';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs';

@Component({
  selector: 'ewd-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit, AfterViewInit {
  public bookControl: FormControl = new FormControl();
  public chapterControl: FormControl = new FormControl();
  public verseControl: FormControl = new FormControl();
  private _scripture: IScriptures =  {
    book: 'Genesis',
    chapter: 1,
    verse: 1
  };
  public scripture: IScriptures = { ...this._scripture };
  public bookList: Array<string> = [];
  public chapterList: number[]  = [];
  public verseList: number[] = [];
  public filteredBookList: Observable<any>;
  public filteredChapterList: Observable<any>;
  public filteredVerseList: Observable<any>;
  public passages: Array<any>;
  public maxChap: number;
  public maxVerse: number;

  public focusElementNo: number;
  public scrolled = <boolean>false;

  public _showSearchPane = <boolean>false;
  public showProgressbar = <boolean> false;

  constructor(
    private _scripturesProvider: ScripturesService
  ) { }

  ngOnInit() {
    this.scrolled = false;

    this.populateBookList();
    this.populateChapterList();
    this.populateVerseList();

    this.filteredBookList = this.bookControl.valueChanges
      .pipe(
        map((value) => this._filter(value, this.bookList))
      );

    this.filteredChapterList = this.chapterControl.valueChanges
      .pipe(
        map((value) => this._filter(value, this.chapterList)),
        map(val => val.map(cur => parseInt(cur, 10)))
      );

    this.filteredVerseList = this.verseControl.valueChanges
      .pipe(
        map((value) => this._filter(value, this.verseList)),
        map(val => val.map(cur => parseInt(cur, 10))),
      );

    this.searchScripture();
  }

  ngAfterViewInit(): void {
    this.scrolled = false;
  }

  @HostListener('window:scroll') onWindowScroll(): void {
    this.scrolled = true;
  }

  private _filter(val: string, data: any): string[] {
    const filterValue = val.toString().toLowerCase();
    return data.filter((d: any) => d.toString().toLowerCase().includes(filterValue));
  }

  public keepFocus(no: number): void {
    this.focusElementNo = no;
    this.scripture.verse = no;
    console.log({ focus: this.focusElementNo, no });
  }

  public validateChapter(el: any, e: any): void {
    if (parseInt(el.value, 10) > this.chapterList.length) {
      this.scripture.chapter = this.chapterList.length;
    }

    this.searchScripture();
  }

  public validateVerse(el: any, e: any): void {
    if (parseInt(el.value, 10) > this.verseList.length) {
      this.scripture.verse = this.verseList.length;
    }

    this.searchScripture();
  }

  public previousScripture(e: any): void {
    Object.assign(this.scripture, e);
    this.searchScripture();
  }

  public nextScripture(e: any): void {
    Object.assign(this.scripture, e);
    this.searchScripture();
  }

  public searchScripture(): void {
    this.showProgressbar = true;
    const {book, chapter} = this.scripture;

    if (
      book !== '' && book !== undefined && book !== ' ' && book !== null &&
      chapter !== undefined && chapter !== null &&
      (typeof chapter === 'string' ? chapter !== ' ' : true)
      ) {
      this.focusElementNo = parseInt(this.scripture.verse.toString(), 10);

      this.populateChapterList();
      this.getPassage(book.toLowerCase(), chapter);
    }
  }

  private getPassage(b: string, c: number): void {
    this._scripturesProvider
      .getPassage(b, c)
      .subscribe(
        (data: string[]) => {
          this.passages = data;
          this.showProgressbar = false;
        },
        (error) => console.log({error})
      );
  }

  private populateVerseList(): void {
    const {book, chapter, verse} = this.scripture;

    this._scripturesProvider
    .getVerseLength(book.toLowerCase(), chapter)
    .subscribe(
      (data) => {
        this.maxVerse = data;
        this.verseList = this.generateListNumbers(data);

        if (verse > this.verseList.length) {
          this.scripture.verse = this.verseList.length;
          this.focusElementNo = parseInt(verse.toString(), 10);
        }
      }
    );
  }

  private populateChapterList(): void {
    this._scripturesProvider
      .getChapterLength(this.scripture.book.toLowerCase())
      .subscribe(
      (data: number) => {
        this.maxChap = data;
        this.chapterList = this.generateListNumbers(data);
        this.populateVerseList();
      }
    );
  }

  private generateListNumbers(data: number): number[] {
    const res: number[] = Array.from({ length: data + 1}, (_, i) => i);
    res.shift();
    return res;
  }

  private populateBookList(): void {
    this._scripturesProvider
      .getBookList()
      .subscribe(
        (data) => this.bookList.push(data.toString()),
        (error) => console.log(error)
      );
  }

  public collapseSearchPane(e: boolean) {
    this._showSearchPane = e;
  }

  public showSearchPane(): void {
    this._showSearchPane = true;
  }
}
