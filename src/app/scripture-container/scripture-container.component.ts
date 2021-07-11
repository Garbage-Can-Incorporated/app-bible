import { Component, OnInit, Input, AfterContentChecked, OnDestroy } from '@angular/core';

import { IScriptures } from '../interfaces/i-scriptures';

@Component({
  selector: 'ewd-scripture-container',
  templateUrl: './scripture-container.component.html',
  styleUrls: ['./scripture-container.component.scss']
})
export class ScriptureContainerComponent implements OnInit, AfterContentChecked, OnDestroy {
  @Input() passages: Array<string>;
  @Input() focusElementNo = <number>1;
  @Input() resource: IScriptures;
  public book: string;

  private st: any;

  constructor() { }

  ngOnInit() { }

  ngAfterContentChecked(): void {
    this.book = this.resource.book.toUpperCase();
    this.st = setTimeout(() => { }, 1500);
  }

  ngOnDestroy() {
    clearTimeout(this.st);
  }
}
