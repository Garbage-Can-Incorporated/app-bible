import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-scripture-container',
  templateUrl: './scripture-container.component.html',
  styleUrls: ['./scripture-container.component.css']
})
export class ScriptureContainerComponent implements OnInit {
  @Input() passages: Array<string>;
  @Input() book: string;

  constructor() { }

  ngOnInit() { }
}
