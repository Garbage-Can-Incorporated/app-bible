import { Component, OnInit, AfterViewInit, NgZone, ChangeDetectorRef, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';

import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

import { IScriptures } from '../interfaces/i-scriptures';

import { ScripturesService } from '../services/scriptures.service';
import {LastReadService} from '../services/last-read.service';
import { MatAutocompleteTrigger } from '@angular/material';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit, AfterViewInit {
  @ViewChild('bookAutoComplete', {read: MatAutocompleteTrigger, static: true}) public bookAutoComplete: MatAutocompleteTrigger;
  @ViewChild('chapterAutoComplete', {read: MatAutocompleteTrigger, static: true}) public chapAutoComplete: MatAutocompleteTrigger;
  @ViewChild('verseAutoComplete', {read: MatAutocompleteTrigger, static: true}) public verseAutoComplete: MatAutocompleteTrigger;
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
    private _scripturesProvider: ScripturesService,
    private lastRead: LastReadService,
    private _zone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.scripture = this.lastRead.lastRead || {...this._scripture};

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

    interval(100)
      // tslint:disable-next-line: deprecation
      .subscribe((): void => {
        this.updateMatAutoComplete();
      });
  }

  private updateMatAutoComplete(): void {
    this.scrolled = true;

    if (this.chapAutoComplete) {
      if (this.chapAutoComplete.panelOpen === true) {
        this.chapAutoComplete.updatePosition();
      }
    }

    if (this.verseAutoComplete) {
      if (this.verseAutoComplete.panelOpen === true) {
        this.verseAutoComplete.updatePosition();
      }
    }

    if (this.bookAutoComplete) {
      if (this.bookAutoComplete.panelOpen === true) {
        this.bookAutoComplete.updatePosition();
      }
    }

    this.detectChange();
  }

  private _filter(val: string, data: any): string[] {
    const filterValue = val.toString().toLowerCase();
    return data.filter((d: any) => d.toString().toLowerCase().includes(filterValue));
  }

  public keepFocus(no: number): void {
    this.focusElementNo = no;
    this.scripture.verse = no;
    this.detectChange();
  }

  public validateChapter(el: any, e: any): void {
    if (parseInt(el.value, 10) > this.chapterList.length) {
      this.scripture.chapter = this.chapterList.length;
    }

    this.searchScripture();
  }

  public validateVerse(el?: any, verse?: string | number): void {
    if (el && parseInt(el.value, 10) > this.verseList.length) {
      this.scripture.verse = this.verseList.length;
    }

    if (verse && parseInt(verse as string, 10) > this.verseList.length) {
      this.scripture.verse = this.verseList.length;
    }

    this.searchScripture();
  }

  public previousScripture(e: any): void {
    Object.assign(this.scripture, e);
    this.validateVerse(undefined, this.scripture.verse);
    this.searchScripture();
    this.detectChange();
  }

  public nextScripture(e: IScriptures): void {
    Object.assign(this.scripture, e);
    this.validateVerse(undefined, this.scripture.verse);
    this.searchScripture();
    this.detectChange();
  }

  public searchScripture(): void {
    this.showProgressbar = true;
    const {book, verse, chapter} = this.scripture;

    this._zone.run((): void => {
      if (
        book !== '' && book !== undefined &&
        book !== ' ' && book !== null &&
        chapter !== undefined && chapter !== null &&
        (typeof chapter === 'string' ? chapter !== ' ' : true) &&
        verse !== undefined && verse !== null
      ) {
        this.focusElementNo = parseInt(verse.toString(), 10) - 1;

        this.populateChapterList();
        this.getPassage(book.toLowerCase(), chapter);
        this.lastRead.setLastRead(this.scripture);

        this.detectChange();
      }
    });
  }

  private getPassage(b: string, c: number): void {
    this._scripturesProvider
      .getPassage(b, c)
      // tslint:disable-next-line: deprecation
      .subscribe(
        (data: string[]) => {
          this.passages = data;
          this.showProgressbar = false;
        },
        (error) => (this.showProgressbar = false, console.log({error}))
      );
  }

  private populateVerseList(): void {
    const {book, chapter, verse} = this.scripture;

    this._scripturesProvider
      .getVerseLength(book.toLowerCase(), chapter)
      // tslint:disable-next-line: deprecation
      .subscribe(
        (data) => {
          this._zone.run((): void => {
            this.maxVerse = data;
            this.verseList = this.generateListNumbers(data);

            if (verse > this.verseList.length) {
              this.scripture.verse = this.verseList.length;
              this.focusElementNo = parseInt(verse.toString(), 10) - 1;
            }
          });

          this.detectChange();
        },
      () => this.showProgressbar = false
    );
  }

  private populateChapterList(): void {
    this._scripturesProvider
      .getChapterLength(this.scripture.book.toLowerCase())
      // tslint:disable-next-line: deprecation
      .subscribe(
        (data: number) => {
          this._zone.run((): void => {
            this.maxChap = data;
            this.chapterList = this.generateListNumbers(data);
            this.populateVerseList();
            this.detectChange();
          });
        },
        () => this.showProgressbar = false
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
      // tslint:disable-next-line: deprecation
      .subscribe(
        (data): void => this._zone
          .run((): void => (this.bookList.push(data.toString()), this.detectChange())),
        (error): void => (this.showProgressbar = false, console.log(error))
      );
  }

  public showReactionConsole(el: any): void {
    el.toggleIconsVisibility();
  }

  public hideReactionConsole(el: any): void {
    el.toggleIconsVisibility();
  }

  public collapseSearchPane(e: boolean) {
    this._showSearchPane = e;
  }

  public showSearchPane(): void {
    this._showSearchPane = true;
  }

  public detectChange(): void {
    this.changeDetector.detach();
    this.changeDetector.reattach();
    this.changeDetector.detectChanges();
  }
}
