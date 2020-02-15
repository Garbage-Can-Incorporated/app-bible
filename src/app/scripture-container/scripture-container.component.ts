import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-scripture-container',
  templateUrl: './scripture-container.component.html',
  styleUrls: ['./scripture-container.component.css']
})
export class ScriptureContainerComponent implements OnInit, AfterViewInit {
  @Input() passages: Array<string>;
  @Input() itemFocus = <number> 1;
  @Input() book: string;
  public focusElementNo: number;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.focusElementNo = this.itemFocus;
  }
}
