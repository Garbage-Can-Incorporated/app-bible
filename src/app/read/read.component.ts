import { Component, OnInit } from '@angular/core';

export interface IScripture {
  book: string;
  chapter: number;
  verse: number;
}

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {
  private _scripture: IScripture =  {
    book: 'genesis',
    chapter: 1,
    verse: 1
  };
  public scripture: IScripture = { ...this._scripture };
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
}
