import {
  Component, OnInit, Output, EventEmitter, AfterViewInit, ChangeDetectorRef, NgZone,
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
  @Output() closePane: EventEmitter<boolean> = new EventEmitter<boolean>();
  public resultsHeaderText = <string> 'No result(s) yet';
  private totalNoOfResult = <number>0;

  public query: string;
  public results: ISearchResults[] = [];
  public showSpinnerNMock = <boolean> false;
  public mockLength: Array<number> = Array.from({ length: 10 }, (_, i) => i * 1);
  private subscription: Subscription;

  constructor(
    private zone: NgZone,
    private _search: SearchScripturesService,

    private changeDetector: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this._search.listenResult();
  }

  ngAfterViewInit(): void { }

  public collapseButton() {
    this.zone.run((): void => (
      this.closePane.emit(false), this.detectChange()
    ));
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
            const exist = this.results.find(
              (result): boolean => data.matches.some((item) => {
                const anyMatch = (result.matches
                  .find((match) => result.item.bookTitle === data.item.bookTitle &&
                  result.item.chapterNo === data.item.chapterNo &&
                    match.arrayIndex === item.arrayIndex
                  ));
                return anyMatch !== undefined ? true : false;
              })
            );

            console.log(`[Search]`, {exist});

            if (!exist) {
              this.results.push(data);
            }
          } else {
            this.resultsHeaderText = 'No result(s) found!';
          }

          this.showSpinnerNMock = false;
          this.detectChange();
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
    this.zone.run((): void => {
      this.results = [];
      this.detectChange();
    });
  }

  public parseIndex(any) {
    return parseInt(any.toString(), 10) + 1;
  }

  public detectChange(): void {
    this.changeDetector.detach();
    this.changeDetector.reattach();
    this.changeDetector.detectChanges();
  }
}
