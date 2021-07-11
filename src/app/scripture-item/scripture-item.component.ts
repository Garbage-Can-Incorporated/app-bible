import { Component, OnInit, Input } from '@angular/core';

import { IScriptures } from '../interfaces/i-scriptures';

@Component({
  selector: 'ewd-scripture-item',
  templateUrl: './scripture-item.component.html',
  styleUrls: ['./scripture-item.component.scss']
})
export class ScriptureItemComponent implements OnInit {
  @Input() public passage: string;
  @Input() public i: number;
  @Input() focusElementNo: number;
  @Input() resource: IScriptures;

  constructor() { }

  ngOnInit() { }

  public showReactionConsole(el: any): void {
    el.toggleIconsVisibility();
  }

  public hideReactionConsole(el: any): void {
    el.toggleIconsVisibility();
  }
}
