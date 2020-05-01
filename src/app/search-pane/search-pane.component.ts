import {
  Component, OnInit, Output, EventEmitter, ElementRef,
  ViewChild, AfterViewInit, Renderer2,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { ISearchResults } from '../interfaces/i-search-results';

import { SearchScripturesService } from '../services/search-scriptures.service';

@Component({
  selector: 'app-search-pane',
  templateUrl: './search-pane.component.html',
  styleUrls: ['./search-pane.component.css']
})
export class SearchPaneComponent implements OnInit, AfterViewInit {
  @ViewChild('searchRes', { static: false }) srEl: ElementRef;
  @Output() closePane: EventEmitter<boolean> = new EventEmitter<boolean>();
  public resultsHeaderText = <string> 'No result(s) yet';
  private totalNoOfResult = <number>0;

  public query: string;
  public result: any;
  private searchResultContainer: any;
  public showSpinnerNMock = <boolean> false;
  public mockLength: Array<number> = Array.from({ length: 10 }, (_, i) => i * 1);
  private subscription: Subscription;

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

    this._search.listenResult();
  }

  ngAfterViewInit(): void {
    this.searchResultContainer = this.srEl;
  }

  public collapseButton() {
    this.closePane.emit(false);
  }

  public grabInput(el: HTMLInputElement): void {
    if (el.value === '') { return; }

    this.resultsHeaderText = 'Searching for result(s)';
    this.totalNoOfResult = 0;
    this.clearPreviousResult();
    this.showSpinnerNMock = true;

    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }

    this.subscription = this._search.subject
      .subscribe(
        (data: ISearchResults) => {
          if (data !== null) {
            this.result = data;

            if (this.searchResultContainer) {
              this.appendResult(data);
            }

            if (data.matches.length > 0) {
              this.totalNoOfResult += 1;
            }

            this.resultsHeaderText = `${ this.totalNoOfResult } result(s) found`;
          } else {
            this.resultsHeaderText = 'No result(s) found!';
          }

          this.showSpinnerNMock = false;
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

    this._search
      .search(this.query);
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
