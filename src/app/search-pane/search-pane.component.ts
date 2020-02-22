import {
  Component, OnInit, Output, EventEmitter, ElementRef,
  ViewChild, AfterViewInit, Renderer2,
} from '@angular/core';

import { SearchScripturesService } from '../services/search-scriptures.service';
import { ISearchResults } from '../interfaces/i-search-results';

@Component({
  selector: 'app-search-pane',
  templateUrl: './search-pane.component.html',
  styleUrls: ['./search-pane.component.css']
})
export class SearchPaneComponent implements OnInit, AfterViewInit {
  @ViewChild('searchRes', { static: true }) srEl: ElementRef;
  @Output() closePane: EventEmitter<boolean> = new EventEmitter<boolean>();
  public resultsHeaderText = <string> 'No result(s) yet';
  private totalNoOfResult = <number>0;

  public query: string;
  public result = <object>{};
  private searchResultContainer: any;
  public showSpinnerNMock = <boolean> false;
  public mockLength: Array<number> = Array.from({ length: 10 }, (_, i) => i * 1);

  constructor(
    private el: ElementRef,
    private _search: SearchScripturesService,
    private renderer: Renderer2
  ) {}
  ngOnInit() {
    this.el
      .nativeElement
      .children[ 0 ]
      .addEventListener('click', (e: Event) => this.collapseButton());
  }

  ngAfterViewInit(): void {
    this.searchResultContainer = this.srEl;
  }

  public collapseButton() {
    this.closePane.emit(false);
  }

  public grabInput(el: HTMLInputElement): void {
    el.value = '';
    this.totalNoOfResult = 0;
    this.clearPreviousResult();
    this.showSpinnerNMock = true;

    this._search
      .search(this.query)
      .subscribe(
      (data: ISearchResults) => {
        console.log({ data });
        this.result = data;

        if (this.searchResultContainer) {
          this.appendResult(data);
        }

        if (data.matches.length > 0) {
          this.totalNoOfResult += 1;
        }
      },
      (error: any) => {
        console.log({ error });
        this.showSpinnerNMock = false;
      },
      () => {
        this.resultsHeaderText = `${this.totalNoOfResult} result(s) found`;
        this.showSpinnerNMock = false;
      }
    );
  }

  private clearPreviousResult(): void {
    const children: HTMLCollection = this.searchResultContainer
      .nativeElement.children;

    if (children.length > 0) {
      Array.from(children)
        .forEach((cur: Element) => cur.remove());
    }
  }

  private appendResult(data: ISearchResults): void {
    data.matches.forEach((cur) => {
      const parentDiv = this.renderer.createElement('div');
      parentDiv.classList.add('d-flex', 'w-100', 'mb-2', '__app--scripture__result--item', 'px-3');

      const referenceEl = this.renderer.createElement('span');
      referenceEl.classList.add('my-1', 'mr-auto', 'font-weight-bold',
        '__app--scripture__result--item__reference');
      referenceEl.innerText = `${ data.item.bookTitle.toUpperCase() } ${ data.item.chapterNo.split('-')[ 1 ] }:${ cur.arrayIndex + 1 }`;

      const passageEl = this.renderer.createElement('span');
      passageEl.classList.add('w-100', 'd-block', '__app--scripture__result--item__passage');
      passageEl.innerText = ` ${ cur.value }`;

      this.renderer.appendChild(parentDiv, referenceEl);
      this.renderer.appendChild(parentDiv, passageEl);
      this.renderer.appendChild(this.searchResultContainer.nativeElement, parentDiv);
    });
  }
}
