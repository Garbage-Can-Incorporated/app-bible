import { Component, OnInit, Input, AfterContentChecked, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-scripture-container',
  templateUrl: './scripture-container.component.html',
  styleUrls: ['./scripture-container.component.css']
})
export class ScriptureContainerComponent implements OnInit, AfterContentChecked, OnDestroy {
  @Input() passages: Array<string>;
  @Input() focusElementNo = <number>1;
  @Input() book: string;

  private st: any;

  constructor() { }

  ngOnInit() { }

  ngAfterContentChecked(): void {
    this.st = setTimeout(() => { }, 1500);
  }

  ngOnDestroy() {
    clearTimeout(this.st);
  }
}
