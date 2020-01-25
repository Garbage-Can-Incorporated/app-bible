import { Component, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';

import { SearchScripturesService } from '../services/search-scriptures.service';

@Component({
  selector: 'app-search-pane',
  templateUrl: './search-pane.component.html',
  styleUrls: ['./search-pane.component.css']
})
export class SearchPaneComponent implements OnInit {
  @Output() closePane: EventEmitter<boolean> = new EventEmitter<boolean>();

  public query: string;
  public result: any;

  constructor(
    private el: ElementRef,
    private _search: SearchScripturesService
  ) { }

  ngOnInit() {
    this.el.nativeElement
    .children[0]
    .addEventListener('click', (e: Event) => {
      console.log({e});

      this.collapseButton();
    });
  }

  public collapseButton() {
    this.closePane.emit(false);
  }

  public grabInput(): void {
    this.result = [];
    this.result = this._search.search(this.query);
    console.log(this.result);
  }
}
