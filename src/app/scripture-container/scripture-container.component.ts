import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-scripture-container',
  templateUrl: './scripture-container.component.html',
  styleUrls: ['./scripture-container.component.css']
})
export class ScriptureContainerComponent implements OnInit, OnChanges {
  @Input() passages: Array<string>;
  @Input() focusElementNo: number;
  @Input() book: string;

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log({ focus: this.focusElementNo });
    /* if (
      this.itemFocus !== NaN &&
      this.itemFocus !== undefined &&
      this.itemFocus != null
    ) {
      this.focusElementNo = this.itemFocus;
    } */
  }
}
