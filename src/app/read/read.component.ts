import { Component, OnInit, TemplateRef } from '@angular/core';
import { IScriptures } from '../interfaces/i-scriptures';


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

  constructor() { }

  ngOnInit() {
  }

  public searchScripture(): void {
    console.log({scripture: this.scripture, _scripture: this._scripture});
  }

  public showReactionConsole(el: any): void {
    console.log({el});

    el.classList.remove('invisible');
    el.classList.toggle('visible');
    // el.classList.toggle('d-flex');
  }

  public hideReactionConsole(el: any): void {
    el.classList.remove('visible');
    el.classList.toggle('invisible');
  }
}
