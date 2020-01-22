import { Component, OnInit } from '@angular/core';

import { IScriptures } from '../interfaces/i-scriptures';

import { ScripturesService } from '../services/scriptures.service';
import { PlayerService } from '../services/player.service';
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
  public maxChap: number;
  public maxVerse: number;
  public focusElementNo: number;

  public _showSearchPane = <boolean>false;
  public preventOtherVersePlays = <boolean>false;

  constructor(
    private _scripturesProvider: ScripturesService,
    private _player: PlayerService
  ) { }

  ngOnInit() {
    this.populateBookList();
    this.populateChapterList();
    this.populateVerseList();

    this.searchScripture();
  }

  public playChapter(icon: any) {
    this.preventOtherVersePlays = true;

    if (icon.classList.contains('fa-pause')) {
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
      icon.classList.remove('__blue--color');

      this._player.pause();
      this.preventOtherVersePlays = true;
    } else {
      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');

      this._player.PlayChapter(this.passages).subscribe({
        next(data) {
          console.log({ data });
          // scrollIntoView
          // this.preventOtherVersePlays = true;
        },
        error(error) {
          console.log({ error });
          this.preventOtherVersePlays = false;
        },
        complete() {
          console.log('done!');

          icon.classList.replace('fa-pause', 'fa-play');
          this.preventOtherVersePlays = false;
        }
      });
    }
  }

  public stopPlay(): void {
    // this._player.stopSequentialPlay = true;
    this._player.stop();
  }

  private toggleVersePlay (icon, content: string): void {
    if (icon.classList.contains('fa-pause')) {
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');

      icon.classList.remove('__blue--color');

      this._player.pause();
      this.preventOtherVersePlays = false; // tentative
    } else {
      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');

      icon.classList.add('__blue--color');
      this.preventOtherVersePlays = true;

      this._player.play(content)
        .subscribe(
          (data) => {
            console.log(data);
          },
          (error) => {
            console.log(error);
            this.stopPlay();

            this.preventOtherVersePlays = false;
          },
          () => {
            console.log('complete!');
            icon.classList.replace('fa-pause', 'fa-play');
            icon.classList.remove('__blue--color');

            this.preventOtherVersePlays = false;
          }
        );
    }
  }

  public readVerse(i: number, playIcon): void {
    this.toggleVersePlay(playIcon, this.passages[i]);
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
        (data) => {
          this.passages = data;
        },
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

  public likeVerse(el: Element): void {
    if (el.classList.contains('far')) {
      el.classList.replace('far', 'fa');
      el.classList.add('__red--color');
      return;
    }

    if (el.classList.contains('fa')) {
      el.classList.replace('fa', 'far');
      el.classList.remove('__red--color');
      return;
    }
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

  public collapseSearchPane(e: boolean) {
    this._showSearchPane = e;
  }

  public showSearchPane(): void {
    this._showSearchPane = true;
  }
}
