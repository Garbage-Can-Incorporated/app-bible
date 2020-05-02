import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { IScriptures } from '../interfaces/i-scriptures';

@Component({
  selector: 'app-scripture-item',
  templateUrl: './scripture-item.component.html',
  styleUrls: ['./scripture-item.component.css']
})
export class ScriptureItemComponent implements OnInit, OnChanges {
  @Input() public passage: string;
  @Input() public i: number;
  @Input() focusElementNo: number;
  @Input() resource: IScriptures;
  public favIconActive: boolean;

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void { }

  public showReactionConsole(el: any): void {
    el.toggleIconsVisibility();
  }

  public hideReactionConsole(el: any): void {
    el.toggleIconsVisibility();
  }
}
