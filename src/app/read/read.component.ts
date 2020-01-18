import { Component, OnInit } from '@angular/core';

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
  public bookList: any = [
    'genesis',
    'exodus'
  ];
  public playerState = <boolean>false;
  public chapterList: number[] = [1, 2, 3];
  public verseList: number[] = [1, 2, 3];

  constructor(
    private _scripturesProvider: ScripturesService
  ) { }

  ngOnInit() {
    this._scripturesProvider.getBible();
    this._scripturesProvider
    .getBookList()
    .subscribe(
      (data) => {
        this.bookList.push(data.toString());
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public searchScripture(): void {
    console.log({scripture: this.scripture, _scripture: this._scripture});
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
