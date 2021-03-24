import { Component, OnInit, Input, AfterContentChecked, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { IScriptures } from '../interfaces/i-scriptures';

@Component({
  selector: 'app-scripture-container',
  templateUrl: './scripture-container.component.html',
  styleUrls: ['./scripture-container.component.css']
})
export class ScriptureContainerComponent implements OnInit, AfterContentChecked, OnDestroy {
  @Input() passages: Array<string>;
  @Input() focusElementNo = <number>1;
  @Input() resource: IScriptures;
  public book: string;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() { }

  ngAfterContentChecked(): void {
    this.book = this.resource.book.toUpperCase();
    this.detectChange();
  }

  ngOnDestroy() {}

  public detectChange(): void {
    this.changeDetector.detach();
    this.changeDetector.reattach();
    this.changeDetector.detectChanges();
  }
}
