import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';

import { IScriptures } from '../interfaces/i-scriptures';

import { ScripturesService } from '../services/scriptures.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit, AfterViewInit {
  private _scripture: IScriptures =  {
    book: 'genesis',
    chapter: 1,
    verse: 1
  };
  public scripture: IScriptures = { ...this._scripture };
  public bookList: Array<string> = [];
  public chapterList: number[]  = [];
  public verseList: number[] = [];
  public passages: Array<any>;
  public maxChap: number;
  public maxVerse: number;

  public focusElementNo: number;
  public scrolled = <boolean>false;

  public _showSearchPane = <boolean>false;
  public repeatAll = <boolean>false;
  public playerState = <boolean>true;
  private _playerState = <boolean>true;
  public initial = <number>0;

  constructor(
    private _scripturesProvider: ScripturesService,
    private _player: PlayerService
  ) { }

  ngOnInit() {
    this.scrolled = false;

    this.populateBookList();
    this.populateChapterList();
    this.populateVerseList();

    this.searchScripture();
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

  ngAfterViewInit(): void {
    this.scrolled = false;
  }

  @HostListener('window:scroll') onWindowScroll (): void {
    this.scrolled = true;
  }

  public previousScripture(e: any): void {
    Object.assign(this.scripture, e);
    this.searchScripture();
  }

  public nextScripture(e: any): void {
    Object.assign(this.scripture, e);
    this.searchScripture();
  }

  public previous (): void {
    this.stopPlay();

    // calling play
    this.initial -= 2;
    this.playChapter();
  }

  public next(): void {
    this.stopPlay();
    if (this.initial === 0) { ++this.initial; }
    this.playChapter();
  }

  public playChapter() {
    this._playerState = true;

    this._player
    .play(this.passages[this.initial])
    .subscribe(
      (data) => console.log({ data }),
        // scrollIntoView
        // this.preventOtherVersePlays = true;
      (error) => {
        console.log({ error });
        // this.preventOtherVersePlays = false;
        this.stopPlay();
      },
      () => {
        console.log('done!');
        console.log('last played => ', {lastPlayed: this.initial});

        ++this.initial;
        console.log('currently being played', {currentlyPlayed: this.initial});

        if (this.initial === this.passages.length) {
          this.stopPlay();
          this.initial = 0;

          // repeat all
          if (this.repeatAll === true) {
            this.playChapter();
          }
        }

        if (this._playerState === true) {
          this.playChapter();
        }

        this.focusElementNo = this.initial;
      }
    );
  }

  public stopPlay(): void {
    this._player.stop();
    this.togglePlayerState();
    this._playerState = false;
  }

  public pause(): void {
    this._player.pause();
    // this.preventOtherVersePlays = true;
  }

  public searchScripture(): void {
    const {book, verse, chapter} = this.scripture;

    if (
      book !== '' && book !== undefined && book !== ' ' &&
      chapter !== undefined &&
      (typeof chapter === 'string' ? chapter !== ' ' : true)
      ) {
      this.focusElementNo = typeof verse === 'string' ? parseInt(verse, 10) : verse;

      this.populateChapterList();
      this.getPassage(book, chapter);
    }
  }

  private getPassage(b: string, c: number): void {
    this._scripturesProvider
      .getPassage(b, c)
      .subscribe(
        (data: string[]) => this.passages = data,
        (error) => console.log({error})
      );
  }

  private populateVerseList(): void {
    const {book, chapter} = this.scripture;

    this._scripturesProvider
    .getVerseLength(book, chapter)
    .subscribe(
      (data) => {
        this.maxVerse = data;
        this.verseList = this.generateListNumbers(data);
      }
    );
  }

  private populateChapterList(): void {
    this._scripturesProvider.getChapterLength(this.scripture.book).subscribe(
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
        (data) => this.bookList.push(data.toString()/* .charAt(0).toUpperCase() */),
        (error) => console.log(error)
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

  public toggleRepeat(): void {
    this.repeatAll = !this.repeatAll;
  }

  public showReactionConsole(el: any): void {
    el.toggleIconsVisibility();
  }

  public hideReactionConsole(el: any): void {
    el.toggleIconsVisibility();
  }

  public togglePlayerState(): void {
    this.playerState = !this.playerState;
  }

  public collapseSearchPane(e: boolean) {
    this._showSearchPane = e;
  }

  public showSearchPane(): void {
    this._showSearchPane = true;
  }
}
