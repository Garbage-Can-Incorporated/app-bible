import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-scripture-item',
  templateUrl: './scripture-item.component.html',
  styleUrls: ['./scripture-item.component.css']
})
export class ScriptureItemComponent implements OnInit, AfterViewInit {
  @Input() public passage: string;
  @Input() public i: number;
  @Input() itemFocus = <number> 1;
  public focusElementNo: number;

  constructor() { }

  ngOnInit() {
    this.focusElementNo = this.itemFocus;
  }

  ngAfterViewInit(): void {
    // this.focusElementNo = this.itemFocus;
  }

  public showReactionConsole(el: any): void {
    el.toggleIconsVisibility();
  }

  public hideReactionConsole(el: any): void {
    el.toggleIconsVisibility();
  }
}
