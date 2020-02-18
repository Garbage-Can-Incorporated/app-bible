import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-scripture-item',
  templateUrl: './scripture-item.component.html',
  styleUrls: ['./scripture-item.component.css']
})
export class ScriptureItemComponent implements OnInit, OnChanges {
  @Input() public passage: string;
  @Input() public i: number;
  @Input() itemFocus: number;
  public focusElementNo: number;

  constructor() { }

  ngOnInit() {
    this.focusElementNo = this.itemFocus;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.itemFocus !== NaN &&
      this.itemFocus !== undefined &&
      this.itemFocus != null
    ) {
      this.focusElementNo = this.itemFocus;
    }
  }

  public showReactionConsole(el: any): void {
    el.toggleIconsVisibility();
  }

  public hideReactionConsole(el: any): void {
    el.toggleIconsVisibility();
  }
}
